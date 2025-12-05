import { describe, it, expect } from 'vitest';
import {
  isValidGitHubUrl,
  parseGitHubUrl,
  normalizeGitHubUrl,
  validateGitHubUrl,
  formatGitHubError,
  GITHUB_ERROR_MESSAGES
} from '../github-url-utils';

describe('github-url-utils', () => {
  describe('isValidGitHubUrl', () => {
    it('should validate full HTTPS URLs', () => {
      expect(isValidGitHubUrl('https://github.com/facebook/react')).toBe(true);
      expect(isValidGitHubUrl('https://github.com/vercel/next.js')).toBe(true);
      expect(isValidGitHubUrl('https://github.com/user-name/repo_name')).toBe(true);
      expect(isValidGitHubUrl('https://github.com/user.name/repo.name')).toBe(true);
    });

    it('should validate HTTP URLs', () => {
      expect(isValidGitHubUrl('http://github.com/facebook/react')).toBe(true);
    });

    it('should validate URLs without protocol', () => {
      expect(isValidGitHubUrl('github.com/facebook/react')).toBe(true);
      expect(isValidGitHubUrl('github.com/vercel/next.js')).toBe(true);
    });

    it('should validate shorthand format (owner/repo)', () => {
      expect(isValidGitHubUrl('facebook/react')).toBe(true);
      expect(isValidGitHubUrl('vercel/next.js')).toBe(true);
      expect(isValidGitHubUrl('user-name/repo_name')).toBe(true);
    });

    it('should handle URLs with .git suffix', () => {
      expect(isValidGitHubUrl('https://github.com/facebook/react.git')).toBe(true);
      expect(isValidGitHubUrl('github.com/facebook/react.git')).toBe(true);
      expect(isValidGitHubUrl('facebook/react.git')).toBe(true);
    });

    it('should handle URLs with trailing slashes', () => {
      expect(isValidGitHubUrl('https://github.com/facebook/react/')).toBe(true);
      expect(isValidGitHubUrl('github.com/facebook/react/')).toBe(true);
    });

    it('should handle URLs with additional path segments', () => {
      expect(isValidGitHubUrl('https://github.com/facebook/react/tree/main')).toBe(true);
      expect(isValidGitHubUrl('https://github.com/facebook/react/blob/main/README.md')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidGitHubUrl('')).toBe(false);
      expect(isValidGitHubUrl('https://gitlab.com/user/repo')).toBe(false);
      expect(isValidGitHubUrl('https://github.com')).toBe(false);
      expect(isValidGitHubUrl('https://github.com/facebook')).toBe(false);
      expect(isValidGitHubUrl('facebook')).toBe(false);
      expect(isValidGitHubUrl('invalid url')).toBe(false);
      expect(isValidGitHubUrl('user/repo/extra/path')).toBe(false);
    });

    it('should reject URLs with invalid characters', () => {
      expect(isValidGitHubUrl('user@name/repo')).toBe(false);
      expect(isValidGitHubUrl('user/repo#name')).toBe(false);
      expect(isValidGitHubUrl('user/repo name')).toBe(false);
    });
  });

  describe('parseGitHubUrl', () => {
    it('should parse full HTTPS URLs', () => {
      const result = parseGitHubUrl('https://github.com/facebook/react');
      expect(result).toEqual({
        owner: 'facebook',
        repo: 'react',
        url: 'https://github.com/facebook/react',
        branch: 'main'
      });
    });

    it('should parse URLs without protocol', () => {
      const result = parseGitHubUrl('github.com/vercel/next.js');
      expect(result).toEqual({
        owner: 'vercel',
        repo: 'next.js',
        url: 'https://github.com/vercel/next.js',
        branch: 'main'
      });
    });

    it('should parse shorthand format', () => {
      const result = parseGitHubUrl('user-name/repo_name');
      expect(result).toEqual({
        owner: 'user-name',
        repo: 'repo_name',
        url: 'https://github.com/user-name/repo_name',
        branch: 'main'
      });
    });

    it('should handle .git suffix', () => {
      const result = parseGitHubUrl('https://github.com/facebook/react.git');
      expect(result).toEqual({
        owner: 'facebook',
        repo: 'react',
        url: 'https://github.com/facebook/react',
        branch: 'main'
      });
    });

    it('should handle trailing slashes', () => {
      const result = parseGitHubUrl('https://github.com/facebook/react/');
      expect(result).toEqual({
        owner: 'facebook',
        repo: 'react',
        url: 'https://github.com/facebook/react',
        branch: 'main'
      });
    });

    it('should return null for invalid URLs', () => {
      expect(parseGitHubUrl('')).toBeNull();
      expect(parseGitHubUrl('https://gitlab.com/user/repo')).toBeNull();
      expect(parseGitHubUrl('https://github.com')).toBeNull();
      expect(parseGitHubUrl('invalid')).toBeNull();
      expect(parseGitHubUrl('user@name/repo')).toBeNull();
    });
  });

  describe('normalizeGitHubUrl', () => {
    it('should normalize full URLs', () => {
      expect(normalizeGitHubUrl('https://github.com/facebook/react'))
        .toBe('https://github.com/facebook/react');
      
      expect(normalizeGitHubUrl('https://github.com/facebook/react/'))
        .toBe('https://github.com/facebook/react');
      
      expect(normalizeGitHubUrl('https://github.com/facebook/react.git'))
        .toBe('https://github.com/facebook/react');
    });

    it('should normalize URLs with extra path segments', () => {
      expect(normalizeGitHubUrl('https://github.com/facebook/react/tree/main'))
        .toBe('https://github.com/facebook/react');
      
      expect(normalizeGitHubUrl('https://github.com/facebook/react/blob/main/README.md'))
        .toBe('https://github.com/facebook/react');
    });

    it('should normalize URLs with query parameters', () => {
      expect(normalizeGitHubUrl('https://github.com/facebook/react?tab=readme'))
        .toBe('https://github.com/facebook/react');
    });

    it('should handle shorthand formats', () => {
      expect(normalizeGitHubUrl('facebook/react'))
        .toBe('https://github.com/facebook/react');
      
      expect(normalizeGitHubUrl('github.com/facebook/react'))
        .toBe('https://github.com/facebook/react');
    });

    it('should return original URL if parsing fails', () => {
      expect(normalizeGitHubUrl('invalid-url')).toBe('invalid-url');
      // GitLab URL gets normalized to GitHub URL due to URL parsing
      expect(normalizeGitHubUrl('https://gitlab.com/user/repo'))
        .toBe('https://github.com/user/repo');
    });
  });

  describe('validateGitHubUrl', () => {
    it('should validate and provide success result', () => {
      const result = validateGitHubUrl('https://github.com/facebook/react');
      expect(result).toEqual({ isValid: true });
    });

    it('should validate shorthand format', () => {
      const result = validateGitHubUrl('facebook/react');
      expect(result).toEqual({ isValid: true });
    });

    it('should provide error for empty URL', () => {
      const result = validateGitHubUrl('');
      expect(result).toEqual({
        isValid: false,
        error: GITHUB_ERROR_MESSAGES.URL_REQUIRED
      });
    });

    it('should provide error for whitespace-only URL', () => {
      const result = validateGitHubUrl('   ');
      expect(result).toEqual({
        isValid: false,
        error: GITHUB_ERROR_MESSAGES.URL_REQUIRED
      });
    });

    it('should provide error for invalid format', () => {
      const result = validateGitHubUrl('https://gitlab.com/user/repo');
      expect(result).toEqual({
        isValid: false,
        error: GITHUB_ERROR_MESSAGES.INVALID_FORMAT
      });
    });

    it('should provide error for invalid owner name', () => {
      const result = validateGitHubUrl('user@invalid/repo');
      expect(result).toEqual({
        isValid: false,
        error: GITHUB_ERROR_MESSAGES.INVALID_OWNER
      });
    });

    it('should provide error for invalid repo name', () => {
      const result = validateGitHubUrl('user/repo#invalid');
      expect(result).toEqual({
        isValid: false,
        error: GITHUB_ERROR_MESSAGES.INVALID_REPO
      });
    });
  });

  describe('formatGitHubError', () => {
    it('should format GitHub API 404 errors', () => {
      const error = { status: 404, message: 'Not Found' };
      expect(formatGitHubError(error)).toBe(GITHUB_ERROR_MESSAGES.REPO_NOT_FOUND);
    });

    it('should format GitHub API errors with custom message', () => {
      const error = { status: 403, message: 'API rate limit exceeded' };
      expect(formatGitHubError(error)).toBe('API rate limit exceeded');
    });

    it('should format GitHub API errors without message', () => {
      const error = { status: 500 };
      expect(formatGitHubError(error)).toBe(GITHUB_ERROR_MESSAGES.ACCESS_ERROR);
    });

    it('should format Error instances with "not found" message', () => {
      const error = new Error('Repository not found');
      expect(formatGitHubError(error)).toBe(GITHUB_ERROR_MESSAGES.REPO_NOT_FOUND);
    });

    it('should format Error instances with "download" message', () => {
      const error = new Error('Failed to download file');
      expect(formatGitHubError(error)).toBe(GITHUB_ERROR_MESSAGES.DOWNLOAD_ERROR);
    });

    it('should format generic Error instances', () => {
      const error = new Error('Something went wrong');
      expect(formatGitHubError(error)).toBe(GITHUB_ERROR_MESSAGES.ACCESS_ERROR);
    });

    it('should handle unknown error types', () => {
      expect(formatGitHubError('string error')).toBe(GITHUB_ERROR_MESSAGES.ACCESS_ERROR);
      expect(formatGitHubError(null)).toBe(GITHUB_ERROR_MESSAGES.ACCESS_ERROR);
      expect(formatGitHubError(undefined)).toBe(GITHUB_ERROR_MESSAGES.ACCESS_ERROR);
      expect(formatGitHubError(123)).toBe(GITHUB_ERROR_MESSAGES.ACCESS_ERROR);
    });

    it('should handle objects that are not errors', () => {
      const notError = { someField: 'value' };
      expect(formatGitHubError(notError)).toBe(GITHUB_ERROR_MESSAGES.ACCESS_ERROR);
    });
  });

  describe('GITHUB_ERROR_MESSAGES', () => {
    it('should export all expected error messages', () => {
      expect(GITHUB_ERROR_MESSAGES.URL_REQUIRED).toBe('URL is required');
      expect(GITHUB_ERROR_MESSAGES.INVALID_FORMAT).toBe('Invalid GitHub URL. Use format: https://github.com/owner/repo');
      expect(GITHUB_ERROR_MESSAGES.INVALID_OWNER).toBe('Invalid repository owner name');
      expect(GITHUB_ERROR_MESSAGES.INVALID_REPO).toBe('Invalid repository name');
      expect(GITHUB_ERROR_MESSAGES.REPO_NOT_FOUND).toBe('Repository not found or not public');
      expect(GITHUB_ERROR_MESSAGES.NO_DEPS_FOUND).toBe('No dependency files found (package.json, requirements.txt, pubspec.yaml)');
      expect(GITHUB_ERROR_MESSAGES.DOWNLOAD_ERROR).toBe('Error downloading file');
      expect(GITHUB_ERROR_MESSAGES.ACCESS_ERROR).toBe('Error accessing GitHub repository');
    });
  });
});
