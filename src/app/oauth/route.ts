import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "octokit";

import { createAdminClient } from "@/lib/appwrite";
import { AUTH_COOKIE } from "@/features/auth/constants";
import { DATABASE_ID, USER_PROFILES_ID } from "@/config";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");

  if (!userId || !secret) {
    return new NextResponse("Missing credentials", { status: 400 });
  }

  const { account, users, databases } = await createAdminClient();
  const session = await account.createSession(userId, secret);
  (await cookies()).set(AUTH_COOKIE, session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  try {
    const user = await users.get(userId);

    // Get the session to access provider access token
    const sessions = await users.listSessions(userId);
    const currentSession = sessions.sessions.find(s => s.$id === session.$id);

    if (currentSession && currentSession.providerAccessToken) {
      const octokit = new Octokit({
        auth: currentSession.providerAccessToken
      });

      // Fetch GitHub user profile
      const { data: githubUser } = await octokit.rest.users.getAuthenticated();

      try {
        await databases.createDocument(
          DATABASE_ID,
          USER_PROFILES_ID,
          userId,
          {
            userId: userId,
            email: user.email,
            name: user.name,
            githubUsername: githubUser.login,
            githubId: githubUser.id.toString(),
            avatarUrl: githubUser.avatar_url,
            publicRepos: githubUser.public_repos,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        );
      } catch (error) {
        // If document already exists (code 409), update it instead
        if (error && typeof error === 'object' && 'code' in error && error.code === 409) {
          await databases.updateDocument(
            DATABASE_ID,
            USER_PROFILES_ID,
            userId,
            {
              email: user.email,
              name: user.name,
              githubUsername: githubUser.login,
              avatarUrl: githubUser.avatar_url,
              publicRepos: githubUser.public_repos,
              updatedAt: new Date().toISOString(),
            }
          );
        } else {
          console.error("Failed to store user profile:", error);
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch GitHub profile:", error);
  }

  return NextResponse.redirect(`${request.nextUrl.origin}/`);
}
