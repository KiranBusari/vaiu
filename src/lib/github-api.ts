import { Octokit } from "octokit";
import { createAdminClient } from "@/lib/appwrite";
import { DATABASE_ID, USER_PROFILES_ID } from "@/config";

/**
 * Get GitHub access token for a user
 */
export async function getGithubAccessToken(userId: string): Promise<string | null> {
    try {
        const { databases } = await createAdminClient();
        const profile = await databases.getDocument(DATABASE_ID, USER_PROFILES_ID, userId);
        return profile.githubAccessToken || null;
    } catch (error) {
        console.error("Failed to get GitHub access token:", error);
        return null;
    }
}

/**
 * Create a GitHub repository for a user
 */
export async function createGithubRepository(
    userId: string,
    repoName: string,
    options?: {
        description?: string;
        private?: boolean;
        autoInit?: boolean;
    }
) {
    const accessToken = await getGithubAccessToken(userId);

    if (!accessToken) {
        throw new Error("GitHub access token not found. User needs to authenticate with GitHub.");
    }

    const octokit = new Octokit({ auth: accessToken });

    try {
        const { data: repo } = await octokit.rest.repos.createForAuthenticatedUser({
            name: repoName,
            description: options?.description,
            private: options?.private ?? false,
            auto_init: options?.autoInit ?? true,
        });

        return repo;
    } catch (error: any) {
        console.error("Failed to create GitHub repository:", error);
        throw new Error(`Failed to create repository: ${error.message}`);
    }
}

/**
 * Get user's GitHub repositories
 */
export async function getUserGithubRepositories(userId: string) {
    const accessToken = await getGithubAccessToken(userId);

    if (!accessToken) {
        throw new Error("GitHub access token not found. User needs to authenticate with GitHub.");
    }

    const octokit = new Octokit({ auth: accessToken });

    try {
        const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
            sort: "updated",
            per_page: 100,
        });

        return repos;
    } catch (error: any) {
        console.error("Failed to fetch GitHub repositories:", error);
        throw new Error(`Failed to fetch repositories: ${error.message}`);
    }
}

/**
 * Create a branch in a repository
 */
export async function createGithubBranch(
    userId: string,
    owner: string,
    repo: string,
    branchName: string,
    fromBranch: string = "main"
) {
    const accessToken = await getGithubAccessToken(userId);

    if (!accessToken) {
        throw new Error("GitHub access token not found. User needs to authenticate with GitHub.");
    }

    const octokit = new Octokit({ auth: accessToken });

    try {
        // Get the SHA of the source branch
        const { data: refData } = await octokit.rest.git.getRef({
            owner,
            repo,
            ref: `heads/${fromBranch}`,
        });

        // Create new branch
        const { data: newRef } = await octokit.rest.git.createRef({
            owner,
            repo,
            ref: `refs/heads/${branchName}`,
            sha: refData.object.sha,
        });

        return newRef;
    } catch (error: any) {
        console.error("Failed to create GitHub branch:", error);
        throw new Error(`Failed to create branch: ${error.message}`);
    }
}

/**
 * Create a pull request
 */
export async function createGithubPullRequest(
    userId: string,
    owner: string,
    repo: string,
    options: {
        title: string;
        head: string; // branch name
        base: string; // base branch (e.g., 'main')
        body?: string;
    }
) {
    const accessToken = await getGithubAccessToken(userId);

    if (!accessToken) {
        throw new Error("GitHub access token not found. User needs to authenticate with GitHub.");
    }

    const octokit = new Octokit({ auth: accessToken });

    try {
        const { data: pr } = await octokit.rest.pulls.create({
            owner,
            repo,
            title: options.title,
            head: options.head,
            base: options.base,
            body: options.body,
        });

        return pr;
    } catch (error: any) {
        console.error("Failed to create GitHub pull request:", error);
        throw new Error(`Failed to create pull request: ${error.message}`);
    }
}
