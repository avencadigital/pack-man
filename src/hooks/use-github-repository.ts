"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { githubService } from "@/lib/github-service";
import { GitHubRepoData, DependencyFile } from "@/types/github";
import { 
  parseGitHubUrl, 
  formatGitHubError, 
  GITHUB_ERROR_MESSAGES 
} from "@/utils/github-url-utils";

/**
 * Props for the useGitHubRepository hook with accessibility considerations.
 *
 * @interface UseGitHubRepositoryProps
 * @description Defines the callback interface for the GitHub repository hook.
 * Callbacks should handle accessibility announcements and error communication
 * appropriately for screen reader users.
 *
 * @accessibility
 * - Repository discovery completion should be announced to screen readers
 * - Progress updates should not overwhelm assistive technology
 * - Error messages should be clear, actionable, and immediately announced
 * - Success states should provide meaningful feedback about found files
 *
 * @wcag
 * - 3.3.1 Error Identification: Errors are clearly identified and described
 * - 3.3.3 Error Suggestion: Error messages provide suggestions when possible
 * - 4.1.3 Status Messages: Important status changes are announced
 */
interface UseGitHubRepositoryProps {
  /**
   * Callback fired when dependency files are discovered in the repository.
   * @param files - Array of discovered dependency files
   * @accessibility
   * - Should announce discovery with file count and types
   * - Consider announcing if multiple files found requiring user selection
   */
  onFilesDiscovered?: (files: DependencyFile[]) => void;

  /**
   * Callback fired when file content is successfully downloaded.
   * @param content - The file content as string
   * @param file - The dependency file that was downloaded
   * @accessibility
   * - Should announce successful download
   * - May announce file size or processing status
   */
  onFileDownloaded?: (content: string, file: DependencyFile) => void;

  /**
   * Callback fired when any error occurs during repository operations.
   * @param error - Human-readable error message
   * @accessibility
   * - Error should be announced immediately via aria-live region
   * - Message should be clear and actionable when possible
   * - Should not use technical jargon that confuses users
   */
  onError?: (error: string) => void;
}

/**
 * State interface for the GitHub repository hook.
 */
interface GitHubRepositoryState {
  isLoading: boolean;
  error: string | null;
  availableFiles: DependencyFile[];
  selectedFile: DependencyFile | null;
  repoData: GitHubRepoData | null;
  progress: {
    stage: 'idle' | 'validating' | 'searching' | 'downloading';
    message: string;
  };
}

/**
 * Return type for the useGitHubRepository hook.
 */
interface UseGitHubRepositoryReturn {
  /** Current loading state */
  isLoading: boolean;
  /** Current error message, if any */
  error: string | null;
  /** Array of discovered dependency files */
  availableFiles: DependencyFile[];
  /** Currently selected file for download */
  selectedFile: DependencyFile | null;
  /** Current repository data */
  repoData: GitHubRepoData | null;
  /** Current progress information */
  progress: GitHubRepositoryState['progress'];

  /** Search for dependency files in a GitHub repository */
  searchRepository: (url: string) => Promise<void>;
  /** Download content from a specific dependency file */
  downloadFile: (file: DependencyFile) => Promise<string>;
  /** Reset all state to initial values */
  reset: () => void;
  /** Set the selected file */
  setSelectedFile: (file: DependencyFile | null) => void;
}

/**
 * Custom hook for managing GitHub repository operations.
 *
 * @param props - Configuration object with callback functions
 * @returns Object with state and methods for GitHub repository operations
 *
 * @accessibility
 * - All state changes should be announced appropriately
 * - Error states should be immediately communicated to assistive technology
 * - Progress updates should provide meaningful context without overwhelming users
 *
 * @example
 * ```typescript
 * const {
 *   searchRepository,
 *   downloadFile,
 *   isLoading,
 *   availableFiles,
 *   error
 * } = useGitHubRepository({
 *   onFilesDiscovered: (files) => {
 *     console.log(`Found ${files.length} dependency files`);
 *   },
 *   onError: (error) => {
 *     console.error('GitHub operation failed:', error);
 *   }
 * });
 * ```
 */
export function useGitHubRepository(props: UseGitHubRepositoryProps = {}): UseGitHubRepositoryReturn {
  const { onFilesDiscovered, onFileDownloaded, onError } = props;
  const { toast } = useToast();

  const [state, setState] = useState<GitHubRepositoryState>({
    isLoading: false,
    error: null,
    availableFiles: [],
    selectedFile: null,
    repoData: null,
    progress: {
      stage: 'idle',
      message: ''
    }
  });

  const setError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      error,
      isLoading: false,
      progress: { stage: 'idle', message: '' }
    }));
    onError?.(error);
    toast({
      title: "GitHub Error",
      description: error,
      variant: "destructive",
    });
  }, [onError, toast]);

  const setProgress = useCallback((stage: GitHubRepositoryState['progress']['stage'], message: string) => {
    setState(prev => ({
      ...prev,
      progress: { stage, message }
    }));
  }, []);

  const searchRepository = useCallback(async (url: string) => {
    if (!url.trim()) {
      setError(GITHUB_ERROR_MESSAGES.URL_REQUIRED);
      return;
    }

    // Parse the GitHub URL using centralized utility
    const repoData = parseGitHubUrl(url);
    if (!repoData) {
      setError(GITHUB_ERROR_MESSAGES.INVALID_FORMAT);
      return;
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      availableFiles: [],
      selectedFile: null,
      repoData
    }));

    try {
      // Step 1: Validate repository exists and is accessible
      setProgress('validating', 'Validating repository...');

      const isValid = await githubService.validateRepository(repoData.owner, repoData.repo);
      if (!isValid) {
        setError(GITHUB_ERROR_MESSAGES.REPO_NOT_FOUND);
        return;
      }

      // Step 2: Search for dependency files
      setProgress('searching', 'Searching for dependency files...');

      const files = await githubService.searchDependencyFiles(repoData.owner, repoData.repo);

      if (files.length === 0) {
        setError(GITHUB_ERROR_MESSAGES.NO_DEPS_FOUND);
        return;
      }

      // Success - update state and notify
      setState(prev => ({
        ...prev,
        isLoading: false,
        availableFiles: files,
        progress: { stage: 'idle', message: '' }
      }));

      onFilesDiscovered?.(files);

      const fileTypes = files.map(f => f.type).join(', ');
      toast({
        title: "Files found",
        description: `Found ${files.length} file(s): ${fileTypes}`,
      });

    } catch (error) {
      // Use centralized error formatting
      const errorMessage = formatGitHubError(error);
      setError(errorMessage);
    }
  }, [setError, setProgress, onFilesDiscovered, toast]);

  const downloadFile = useCallback(async (file: DependencyFile): Promise<string> => {
    if (!file.downloadUrl) {
      throw new Error("Download URL not available");
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      selectedFile: file
    }));

    try {
      setProgress('downloading', `Downloading ${file.name}...`);

      const content = await githubService.downloadFileContent(file.downloadUrl);

      setState(prev => ({
        ...prev,
        isLoading: false,
        progress: { stage: 'idle', message: '' }
      }));

      onFileDownloaded?.(content, file);

      toast({
        title: "Download completed",
        description: `${file.name} downloaded successfully`,
      });

      return content;
    } catch (error) {
      const errorMessage = formatGitHubError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [setError, setProgress, onFileDownloaded, toast]);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      availableFiles: [],
      selectedFile: null,
      repoData: null,
      progress: {
        stage: 'idle',
        message: ''
      }
    });
  }, []);

  const setSelectedFile = useCallback((file: DependencyFile | null) => {
    setState(prev => ({
      ...prev,
      selectedFile: file
    }));
  }, []);

  return {
    isLoading: state.isLoading,
    error: state.error,
    availableFiles: state.availableFiles,
    selectedFile: state.selectedFile,
    repoData: state.repoData,
    progress: state.progress,
    searchRepository,
    downloadFile,
    reset,
    setSelectedFile
  };
}