import { Octokit, RequestError } from "octokit";
import { createAdminClient } from "@/lib/appwrite";
import { DATABASE_ID, USER_PROFILES_ID } from "@/config";

/**
 * Consolidated GitHub API operations
 * All GitHub API calls should be centralized here
 */

// ============================================================================
// ACCESS TOKEN MANAGEMENT
// ============================================================================

/**
 * Get GitHub OAuth access token for a user from their profile
 * Users must authenticate with GitHub OAuth to use GitHub features
 */
export async function getAccessToken(userId: string): Promise<string | null> {
    try {
        const { databases } = await createAdminClient();
        const profile = await databases.getDocument(
            DATABASE_ID,
            USER_PROFILES_ID,
            userId
        );

        return profile.githubAccessToken || null;
    } catch (error) {
        console.error("Failed to get GitHub access token from profile:", error);
        return null;
    }
}

// ============================================================================
// REPOSITORY OPERATIONS
// ============================================================================

/**
 * Create a new GitHub repository
 */
export async function createRepository(
    accessToken: string,
    repoName: string
) {
    const octokit = new Octokit({ auth: accessToken });

    const repo = await octokit.rest.repos.createForAuthenticatedUser({
        name: repoName,
    });

    return repo.data;
}

/**
 * Delete a GitHub repository
 */
export async function deleteRepository(
    accessToken: string,
    owner: string,
    repo: string
) {
    const octokit = new Octokit({ auth: accessToken });

    await octokit.rest.repos.delete({
        owner,
        repo,
    });
}

/**
 * Get repository information
 */
export async function getRepository(
    accessToken: string,
    owner: string,
    repo: string
) {
    const octokit = new Octokit({ auth: accessToken });

    const { data } = await octokit.rest.repos.get({
        owner,
        repo,
    });

    return data;
}

// ============================================================================
// USER OPERATIONS
// ============================================================================

/**
 * Get authenticated user information
 */
export async function getAuthenticatedUser(accessToken: string) {
    const octokit = new Octokit({ auth: accessToken });

    const { data: user } = await octokit.rest.users.getAuthenticated();
    return user;
}

/**
 * Get user by username
 */
export async function getUserByUsername(
    accessToken: string | null,
    username: string
) {
    const octokit = new Octokit({ auth: accessToken || undefined });

    const { data: user } = await octokit.rest.users.getByUsername({
        username,
    });

    return user;
}

/**
 * List repositories for a user
 */
export async function listUserRepositories(
    accessToken: string | null,
    username: string,
    options?: {
        sort?: "created" | "updated" | "pushed" | "full_name";
        per_page?: number;
    }
) {
    const octokit = new Octokit({ auth: accessToken || undefined });

    const { data: repos } = await octokit.rest.repos.listForUser({
        username,
        sort: options?.sort || "updated",
        per_page: options?.per_page || 30,
    });

    return repos;
}

/**
 * Get user's email addresses
 */
export async function getUserEmails(accessToken: string) {
    const octokit = new Octokit({ auth: accessToken });

    const { data: emails } = await octokit.rest.users.listEmailsForAuthenticatedUser();
    return emails;
}

// ============================================================================
// COLLABORATOR OPERATIONS
// ============================================================================

/**
 * Check if user is a collaborator on a repository
 */
export async function checkCollaborator(
    accessToken: string,
    owner: string,
    repo: string,
    username: string
) {
    const octokit = new Octokit({ auth: accessToken });

    try {
        await octokit.rest.repos.checkCollaborator({
            owner,
            repo,
            username,
        });
        return true;
    } catch (error) {
        if (error instanceof RequestError && error.status === 404) {
            return false;
        }
        throw error;
    }
}

/**
 * Add a collaborator to a repository
 */
export async function addCollaborator(
    accessToken: string,
    owner: string,
    repo: string,
    username: string,
    permission: "pull" | "push" | "admin" | "maintain" | "triage" = "push"
) {
    const octokit = new Octokit({ auth: accessToken });

    await octokit.rest.repos.addCollaborator({
        owner,
        repo,
        username,
        permission,
    });
}

// ============================================================================
// ISSUE OPERATIONS
// ============================================================================

/**
 * List issues for a repository
 */
export async function listRepositoryIssues(
    accessToken: string,
    owner: string,
    repo: string,
    state?: "open" | "closed" | "all"
) {
    const octokit = new Octokit({ auth: accessToken });

    const { data: issues } = await octokit.rest.issues.listForRepo({
        owner,
        repo,
        state: state || "open",
    });

    return issues;
}

/**
 * Create a new issue
 */
export async function createIssue(
    accessToken: string,
    owner: string,
    repo: string,
    title: string,
    body?: string,
    assignees?: string[]
) {
    const octokit = new Octokit({ auth: accessToken });

    const { data: issue } = await octokit.rest.issues.create({
        owner,
        repo,
        title,
        body,
        assignees,
    });

    return issue;
}

/**
 * Update an issue
 */
export async function updateIssue(
    accessToken: string,
    owner: string,
    repo: string,
    issueNumber: number,
    updates: {
        title?: string;
        body?: string;
        state?: "open" | "closed";
        assignees?: string[];
        labels?: string[];
    }
) {
    const octokit = new Octokit({ auth: accessToken });

    const { data: issue } = await octokit.rest.issues.update({
        owner,
        repo,
        issue_number: issueNumber,
        ...updates,
    });

    return issue;
}

/**
 * Add assignees to an issue
 */
export async function addIssueAssignees(
    accessToken: string,
    owner: string,
    repo: string,
    issueNumber: number,
    assignees: string[]
) {
    const octokit = new Octokit({ auth: accessToken });

    await octokit.rest.issues.addAssignees({
        owner,
        repo,
        issue_number: issueNumber,
        assignees,
    });
}

// ============================================================================
// PULL REQUEST OPERATIONS
// ============================================================================

/**
 * List pull requests for a repository
 */
export async function listPullRequests(
    accessToken: string,
    owner: string,
    repo: string,
    state: "open" | "closed" | "all" = "all"
) {
    const octokit = new Octokit({ auth: accessToken });

    const { data: pullRequests } = await octokit.rest.pulls.list({
        owner,
        repo,
        state,
    });

    return pullRequests;
}

/**
 * Get a specific pull request
 */
export async function getPullRequest(
    accessToken: string,
    owner: string,
    repo: string,
    pullNumber: number
) {
    const octokit = new Octokit({ auth: accessToken });

    const { data: pr } = await octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: pullNumber,
    });

    return pr;
}

/**
 * Create a pull request
 */
export async function createPullRequest(
    accessToken: string,
    owner: string,
    repo: string,
    title: string,
    head: string,
    base: string,
    body?: string
) {
    const octokit = new Octokit({ auth: accessToken });

    const { data: pr } = await octokit.rest.pulls.create({
        owner,
        repo,
        title,
        body,
        head,
        base,
    });

    return pr;
}

/**
 * List files changed in a pull request
 */
export async function listPullRequestFiles(
    accessToken: string,
    owner: string,
    repo: string,
    pullNumber: number
) {
    const octokit = new Octokit({ auth: accessToken });

    const { data: files } = await octokit.rest.pulls.listFiles({
        owner,
        repo,
        pull_number: pullNumber,
    });

    return files;
}

/**
 * List reviews for a pull request
 */
export async function listPullRequestReviews(
    accessToken: string,
    owner: string,
    repo: string,
    pullNumber: number
) {
    const octokit = new Octokit({ auth: accessToken });

    const { data: reviews } = await octokit.rest.pulls.listReviews({
        owner,
        repo,
        pull_number: pullNumber,
    });

    return reviews;
}

/**
 * List commits in a pull request
 */
export async function listPullRequestCommits(
    accessToken: string,
    owner: string,
    repo: string,
    pullNumber: number
) {
    const octokit = new Octokit({ auth: accessToken });

    const { data: commits } = await octokit.rest.pulls.listCommits({
        owner,
        repo,
        pull_number: pullNumber,
    });

    return commits;
}
