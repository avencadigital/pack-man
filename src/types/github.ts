// GitHub API response types
export interface GitHubApiResponse {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: 'file' | 'dir';
  content?: string;
  encoding?: string;
}

export interface GitHubError {
  message: string;
  status: number;
  documentation_url?: string;
  originalError?: string;
}

// Internal data models
export interface GitHubRepoData {
  owner: string;
  repo: string;
  url: string;
  branch?: string;
}

export interface DependencyFile {
  name: string;
  path: string;
  type: 'package.json' | 'requirements.txt' | 'pubspec.yaml';
  downloadUrl: string;
  size: number;
}

export interface GitHubContent {
  name: string;
  path: string;
  content: string; // base64 encoded
  encoding: string;
  size: number;
  type: 'file' | 'dir';
}

// Service interfaces
export interface GitHubService {
  getRepositoryContent(owner: string, repo: string, path: string): Promise<GitHubContent>;
  searchDependencyFiles(owner: string, repo: string): Promise<DependencyFile[]>;
  validateRepository(owner: string, repo: string): Promise<boolean>;
}