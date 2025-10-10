export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio?: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepository {
  name: string;
  description?: string;
  html_url: string;
  language?: string;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  created_at: string;
  pushed_at: string;
}

export interface LanguageStats {
  [language: string]: {
    count: number;
    bytes: number;
    percentage: number;
  };
}

export interface ProfileAnalytics {
  user: GitHubUser;
  repositories: GitHubRepository[];
  languageStats: LanguageStats;
  topRepositories: {
    mostStarred: GitHubRepository[];
    mostForked: GitHubRepository[];
    recentlyActive: GitHubRepository[];
  };
  collaborationStats: {
    totalCollaborators: number;
    organizationsCount: number;
    forksOfOthers: number;
    contributedTo: number;
  };
  totalStars: number;
  totalForks: number;
}