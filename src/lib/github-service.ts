import axios, { AxiosError } from 'axios';
import { GitHubApiResponse, GitHubContent, GitHubError, DependencyFile } from '@/types/github';

const GITHUB_API_BASE = 'https://api.github.com';

// GitHub token management
class GitHubTokenManager {
    private static instance: GitHubTokenManager;
    private token: string | null = null;

    private constructor() {
        // Try to load token from localStorage on client side
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('github_token');
        }
        // Try to load from environment variable
        if (!this.token && process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
            this.token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
        }
    }

    static getInstance(): GitHubTokenManager {
        if (!GitHubTokenManager.instance) {
            GitHubTokenManager.instance = new GitHubTokenManager();
        }
        return GitHubTokenManager.instance;
    }

    setToken(token: string | null): void {
        this.token = token;
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('github_token', token);
            } else {
                localStorage.removeItem('github_token');
            }
        }
    }

    getToken(): string | null {
        return this.token;
    }

    hasToken(): boolean {
        return !!this.token;
    }

    clearToken(): void {
        this.setToken(null);
    }
}

const tokenManager = GitHubTokenManager.getInstance();

// Supported dependency files to search for
const DEPENDENCY_FILES = [
    { name: 'package.json', type: 'package.json' as const },
    { name: 'requirements.txt', type: 'requirements.txt' as const },
    { name: 'pubspec.yaml', type: 'pubspec.yaml' as const }
];

class GitHubServiceImpl {
    private getHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Pack-Man-Dependency-Analyzer'
        };

        const token = tokenManager.getToken();
        if (token) {
            console.log('Using GitHub token for authentication');
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.log('No GitHub token available - using unauthenticated requests');
        }

        return headers;
    }

    private async makeRequest<T>(url: string): Promise<T> {
        try {
            console.log('GitHub API Request:', { url, headers: this.getHeaders() });

            const response = await axios.get<T>(url, {
                headers: this.getHeaders(),
                timeout: 10000
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                const status = axiosError.response?.status || 500;

                // Log detailed error information (but less verbose for expected 404s)
                if (status === 404) {
                    console.log(`GitHub API 404 (file not found): ${url}`);
                } else {
                    console.error('GitHub API Error Details:', {
                        url,
                        status,
                        statusText: axiosError.response?.statusText,
                        responseData: axiosError.response?.data,
                        errorMessage: axiosError.message,
                        errorCode: axiosError.code,
                        isTimeout: axiosError.code === 'ECONNABORTED'
                    });
                    
                    // Also log the raw error for debugging (non-404 errors)
                    console.error('Raw GitHub API Error:', axiosError);
                }

                const message = this.getErrorMessage(status, axiosError);

                // Type the response data to include potential GitHub API error fields
                const responseData = axiosError.response?.data as {
                    documentation_url?: string;
                    message?: string;
                } | undefined;

                throw {
                    message,
                    status,
                    documentation_url: responseData?.documentation_url,
                    originalError: responseData?.message
                } as GitHubError;
            }

            console.error('Non-Axios error in GitHub request:', error);

            // Handle network errors or other non-HTTP errors
            throw {
                message: 'Network error: Unable to connect to GitHub',
                status: 0,
                originalError: error instanceof Error ? error.message : String(error)
            } as GitHubError;
        }
    }

    private getErrorMessage(status: number, error: AxiosError): string {
        const responseData = error.response?.data as { message?: string } | undefined;
        const githubMessage = responseData?.message;

        // Log the response data for debugging
        console.log('GitHub API response data for error:', responseData);

        switch (status) {
            case 0:
                return 'Network error: Unable to connect to GitHub. Please check your internet connection';
            case 401:
                return 'GitHub authentication failed. Please check your token and try again';
            case 404:
                return 'Repository not found. Please check the URL and try again';
            case 403:
                if (error.response?.headers?.['x-ratelimit-remaining'] === '0') {
                    return 'GitHub API rate limit exceeded. Please try again later';
                }
                if (githubMessage?.includes('rate limit')) {
                    return 'GitHub API rate limit exceeded. Please try again later';
                }
                return 'Access denied. This may be a private repository or you need authentication';
            case 422:
                return `GitHub API error: ${githubMessage || 'Invalid request parameters'}`;
            case 429:
                return 'GitHub API rate limit exceeded. Please try again later';
            case 500:
            case 502:
            case 503:
                return 'GitHub is temporarily unavailable. Please try again later';
            default:
                const baseMessage = `Failed to access GitHub repository (HTTP ${status})`;
                const errorDetails = error.code ? ` (${error.code})` : '';
                return githubMessage ?
                    `${baseMessage}: ${githubMessage}${errorDetails}` :
                    `${baseMessage}${errorDetails}. Please try again`;
        }
    }

    async validateRepository(owner: string, repo: string): Promise<boolean> {
        try {
            console.log('Validating repository:', { owner, repo });

            const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}`;
            const result = await this.makeRequest(url);

            console.log('Repository validation successful:', result);
            return true;
        } catch (error) {
            const githubError = error as GitHubError;

            console.log('Repository validation failed:', {
                owner,
                repo,
                status: githubError.status,
                message: githubError.message
            });

            if (githubError.status === 404) {
                return false;
            }
            if (githubError.status === 403) {
                // Check if the error message indicates rate limiting
                if (githubError.message?.includes('rate limit')) {
                    throw error; // Rate limit should be thrown
                }
                return false; // Private repo or access denied
            }
            throw error;
        }
    }

    async getRepositoryContent(owner: string, repo: string, path: string): Promise<GitHubContent> {
        const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`;
        const response = await this.makeRequest<GitHubApiResponse>(url);

        if (response.type !== 'file') {
            throw {
                message: 'Path does not point to a file',
                status: 400
            } as GitHubError;
        }

        if (!response.content || !response.encoding) {
            throw {
                message: 'File content not available',
                status: 400
            } as GitHubError;
        }

        return {
            name: response.name,
            path: response.path,
            content: response.content,
            encoding: response.encoding,
            size: response.size,
            type: response.type
        };
    }

    async searchDependencyFiles(owner: string, repo: string): Promise<DependencyFile[]> {
        const foundFiles: DependencyFile[] = [];

        // Search for each dependency file type in the root directory
        for (const depFile of DEPENDENCY_FILES) {
            try {
                const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${depFile.name}`;
                const response = await this.makeRequest<GitHubApiResponse>(url);

                if (response.type === 'file' && response.download_url) {
                    console.log(`Found dependency file: ${depFile.name}`);
                    foundFiles.push({
                        name: response.name,
                        path: response.path,
                        type: depFile.type,
                        downloadUrl: response.download_url,
                        size: response.size
                    });
                }
            } catch (error) {
                const githubError = error as GitHubError;
                // Ignore 404 errors (file not found), but throw other errors
                if (githubError.status === 404) {
                    console.log(`Dependency file not found (expected): ${depFile.name}`);
                } else {
                    console.error(`Error searching for ${depFile.name}:`, error);
                    throw error;
                }
            }
        }

        return foundFiles;
    }

    async downloadFileContent(downloadUrl: string): Promise<string> {
        try {
            const response = await axios.get(downloadUrl, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Pack-Man-Dependency-Analyzer'
                },
                responseType: 'text' // Force response to be treated as text
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw {
                    message: 'Failed to download file content',
                    status: error.response?.status || 500
                } as GitHubError;
            }
            throw error;
        }
    }

    // Token management methods
    setToken(token: string | null): void {
        tokenManager.setToken(token);
    }

    getToken(): string | null {
        return tokenManager.getToken();
    }

    hasToken(): boolean {
        return tokenManager.hasToken();
    }

    clearToken(): void {
        tokenManager.clearToken();
    }

    // Validate GitHub token
    async validateToken(token?: string): Promise<{ valid: boolean; user?: any; rateLimit?: any; error?: string }> {
        const testToken = token || tokenManager.getToken();
        if (!testToken) {
            return { valid: false, error: 'No token provided' };
        }

        try {
            const response = await axios.get(`${GITHUB_API_BASE}/user`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Pack-Man-Dependency-Analyzer',
                    'Authorization': `Bearer ${testToken}`
                },
                timeout: 10000
            });

            const rateLimit = {
                limit: response.headers['x-ratelimit-limit'],
                remaining: response.headers['x-ratelimit-remaining'],
                reset: response.headers['x-ratelimit-reset']
            };

            return {
                valid: true,
                user: response.data,
                rateLimit
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    valid: false,
                    error: error.response?.status === 401 ? 'Invalid token' : error.message
                };
            }
            return { valid: false, error: 'Unknown error' };
        }
    }

    // Get current rate limit status
    async getRateLimit(): Promise<any> {
        const token = tokenManager.getToken();
        if (!token) {
            console.log('No GitHub token available - returning default unauthenticated rate limit');
            // Return default rate limit for unauthenticated requests
            // GitHub allows 60 requests per hour for unauthenticated requests
            return {
                rate: {
                    limit: 60,
                    remaining: 60,
                    reset: Math.floor(Date.now() / 1000) + 3600,
                    used: 0
                },
                resources: {
                    core: {
                        limit: 60,
                        remaining: 60,
                        reset: Math.floor(Date.now() / 1000) + 3600,
                        used: 0
                    }
                }
            };
        }

        try {
            console.log('Fetching rate limit with authenticated token...');
            const response = await axios.get(`${GITHUB_API_BASE}/rate_limit`, {
                headers: this.getHeaders(),
                timeout: 10000
            });
            console.log('Rate limit fetched successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching rate limit:', error);

            // If token is invalid, clear it and return unauthenticated limits
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.log('Token appears to be invalid, clearing it...');
                tokenManager.clearToken();
                return {
                    rate: {
                        limit: 60,
                        remaining: 60,
                        reset: Math.floor(Date.now() / 1000) + 3600,
                        used: 0
                    },
                    error: 'Token was invalid and has been cleared'
                };
            }

            // Return null to indicate error, but don't throw
            return null;
        }
    }

    // Debug method to test GitHub connectivity
    async testConnection(): Promise<{ success: boolean; error?: string; details?: any }> {
        try {
            console.log('Testing GitHub API connectivity...');

            // Test basic connectivity with a simple API call
            const response = await axios.get(`${GITHUB_API_BASE}/zen`, {
                headers: {
                    'User-Agent': 'Pack-Man-Dependency-Analyzer'
                },
                timeout: 10000
            });

            console.log('GitHub connectivity test successful:', response.data);

            return {
                success: true,
                details: {
                    message: response.data,
                    status: response.status,
                    hasToken: !!tokenManager.getToken()
                }
            };
        } catch (error) {
            console.error('GitHub connectivity test failed:', error);

            if (axios.isAxiosError(error)) {
                return {
                    success: false,
                    error: `Connection failed: ${error.message}`,
                    details: {
                        status: error.response?.status,
                        statusText: error.response?.statusText,
                        data: error.response?.data
                    }
                };
            }

            return {
                success: false,
                error: 'Unknown connection error'
            };
        }
    }
}

// Export singleton instance
export const githubService = new GitHubServiceImpl();