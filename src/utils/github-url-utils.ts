import { GitHubRepoData, GitHubError } from '@/types/github';

// ============================================================================
// Constants - Single source of truth for patterns and error messages
// ============================================================================

/**
 * Regex patterns for matching GitHub URLs in various formats
 * Supports:
 * - https://github.com/owner/repo
 * - github.com/owner/repo
 * - owner/repo
 */
const GITHUB_URL_PATTERNS = [
  // https://github.com/owner/repo
  /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)(?:\/.*)?$/,
  // github.com/owner/repo
  /^github\.com\/([^\/]+)\/([^\/]+)(?:\/.*)?$/,
  // owner/repo
  /^([^\/\s]+)\/([^\/\s]+)$/
] as const;

/**
 * Pattern for validating owner and repository names
 * Allows: alphanumeric, hyphens, underscores, dots
 */
const VALID_NAME_PATTERN = /^[a-zA-Z0-9._-]+$/;

/**
 * Standardized error messages for GitHub URL validation
 */
export const GITHUB_ERROR_MESSAGES = {
  URL_REQUIRED: 'URL is required',
  INVALID_FORMAT: 'Invalid GitHub URL. Use format: https://github.com/owner/repo',
  INVALID_OWNER: 'Invalid repository owner name',
  INVALID_REPO: 'Invalid repository name',
  REPO_NOT_FOUND: 'Repository not found or not public',
  NO_DEPS_FOUND: 'No dependency files found (package.json, requirements.txt, pubspec.yaml)',
  DOWNLOAD_ERROR: 'Error downloading file',
  ACCESS_ERROR: 'Error accessing GitHub repository'
} as const;

// ============================================================================
// Private Helper Functions - DRY implementation
// ============================================================================

/**
 * Cleans a URL by trimming whitespace, removing trailing slashes and .git suffix
 * @param url - The URL to clean
 * @returns Cleaned URL string
 */
function cleanUrl(url: string): string {
  return url.trim().replace(/\/$/, '').replace(/\.git$/, '');
}

/**
 * Extracts owner and repository from a URL using pattern matching
 * @param url - The URL to parse
 * @returns Object with owner, repo, and optionally an error message
 */
function extractOwnerRepo(url: string): {
  owner?: string;
  repo?: string;
  error?: string;
} {
  const cleaned = cleanUrl(url);
  
  for (const pattern of GITHUB_URL_PATTERNS) {
    const match = cleaned.match(pattern);
    if (match) {
      const [, owner, repo] = match;
      return { 
        owner: owner.trim(), 
        repo: repo.replace(/\.git$/, '').trim() 
      };
    }
  }
  
  return { error: GITHUB_ERROR_MESSAGES.INVALID_FORMAT };
}

/**
 * Validates owner and repository names against allowed pattern
 * @param owner - Repository owner name
 * @param repo - Repository name
 * @returns Validation result with optional error message
 */
function validateOwnerRepo(owner: string, repo: string): {
  isValid: boolean;
  error?: string;
} {
  if (!VALID_NAME_PATTERN.test(owner)) {
    return { isValid: false, error: GITHUB_ERROR_MESSAGES.INVALID_OWNER };
  }
  
  if (!VALID_NAME_PATTERN.test(repo)) {
    return { isValid: false, error: GITHUB_ERROR_MESSAGES.INVALID_REPO };
  }
  
  return { isValid: true };
}

// ============================================================================
// Public API Functions
// ============================================================================

/**
 * Validates if a URL is a valid GitHub repository URL or flexible format
 * @param url - The URL to validate
 * @returns true if valid, false otherwise
 */
export function isValidGitHubUrl(url: string): boolean {
  try {
    const result = extractOwnerRepo(url);
    if (result.error || !result.owner || !result.repo) {
      return false;
    }
    
    const validation = validateOwnerRepo(result.owner, result.repo);
    return validation.isValid;
  } catch {
    return false;
  }
}

/**
 * Extracts repository data from a GitHub URL or flexible format
 * @param url - The URL to parse
 * @returns GitHubRepoData object or null if invalid
 */
export function parseGitHubUrl(url: string): GitHubRepoData | null {
  try {
    const result = extractOwnerRepo(url);
    if (result.error || !result.owner || !result.repo) {
      return null;
    }
    
    const validation = validateOwnerRepo(result.owner, result.repo);
    if (!validation.isValid) {
      return null;
    }
    
    return {
      owner: result.owner,
      repo: result.repo,
      url: `https://github.com/${result.owner}/${result.repo}`,
      branch: 'main' // Default branch, could be enhanced to detect actual default branch
    };
  } catch {
    return null;
  }
}

/**
 * Normalizes a GitHub URL by removing trailing slashes and query parameters
 * @param url - The URL to normalize
 * @returns Normalized URL string
 */
export function normalizeGitHubUrl(url: string): string {
  try {
    // Try to parse as URL object first for full URLs
    if (url.includes('://')) {
      const urlObj = new URL(url);
      let pathname = urlObj.pathname.replace(/\/$/, '');
      
      const pathParts = pathname.split('/').filter(part => part.length > 0);
      if (pathParts.length >= 2) {
        const [owner, repo] = pathParts;
        const cleanRepo = repo.endsWith('.git') ? repo.slice(0, -4) : repo;
        pathname = `/${owner}/${cleanRepo}`;
      }
      
      return `https://github.com${pathname}`;
    }
    
    // For non-URL formats, parse and reconstruct
    const parsed = parseGitHubUrl(url);
    return parsed?.url || url;
  } catch {
    return url;
  }
}

/**
 * Validates GitHub URL format and provides specific error messages
 * @param url - The URL to validate
 * @returns Validation result with optional error message
 */
export function validateGitHubUrl(url: string): { isValid: boolean; error?: string } {
  if (!url || url.trim().length === 0) {
    return { isValid: false, error: GITHUB_ERROR_MESSAGES.URL_REQUIRED };
  }
  
  const result = extractOwnerRepo(url);
  if (result.error) {
    return { isValid: false, error: result.error };
  }
  
  if (!result.owner || !result.repo) {
    return { isValid: false, error: GITHUB_ERROR_MESSAGES.INVALID_FORMAT };
  }
  
  return validateOwnerRepo(result.owner, result.repo);
}

/**
 * Formats a GitHub error into a user-friendly message
 * @param error - The error object from GitHub API or other sources
 * @returns Formatted error message string
 */
export function formatGitHubError(error: unknown): string {
  if (error && typeof error === 'object' && 'status' in error) {
    const githubError = error as GitHubError;
    if (githubError.status === 404) {
      return GITHUB_ERROR_MESSAGES.REPO_NOT_FOUND;
    }
    return githubError.message || GITHUB_ERROR_MESSAGES.ACCESS_ERROR;
  }
  
  if (error instanceof Error) {
    // Check for specific error patterns
    if (error.message.toLowerCase().includes('not found')) {
      return GITHUB_ERROR_MESSAGES.REPO_NOT_FOUND;
    }
    if (error.message.toLowerCase().includes('download')) {
      return GITHUB_ERROR_MESSAGES.DOWNLOAD_ERROR;
    }
    // For generic errors, use the default message for consistency
    return GITHUB_ERROR_MESSAGES.ACCESS_ERROR;
  }
  
  return GITHUB_ERROR_MESSAGES.ACCESS_ERROR;
}
