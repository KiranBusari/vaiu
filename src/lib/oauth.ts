"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

/**
 * Custom GitHub OAuth implementation
 */
export async function signUpWithGithub() {
  const origin = (await headers()).get("origin");

  // Redirect to custom GitHub OAuth route
  return redirect(`${origin}/oauth/github`);
}
