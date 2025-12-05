"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Search,
  X,
} from "lucide-react";
import { useGitHubRepository } from "@/hooks/use-github-repository";
import { DependencyFile } from "@/types/github";
import { validateGitHubUrl } from "@/utils/github-url-utils";

/**
 * Props for the GitHubUrlInput component with accessibility considerations.
 *
 * @interface GitHubUrlInputProps
 * @description Defines the interface for GitHub URL input component that allows users
 * to enter GitHub repository URLs for dependency analysis. Designed with accessibility
 * in mind including proper ARIA labels, keyboard navigation, and screen reader support.
 *
 * @accessibility
 * - URL input should have proper labels and validation feedback
 * - Loading states must be announced to screen readers
 * - Error messages should be associated with the input control
 * - Success states should provide meaningful feedback
 * - All interactive elements should be keyboard accessible
 *
 * @wcag
 * - 2.1.1 Keyboard: All functionality available via keyboard
 * - 3.3.1 Error Identification: Errors are clearly identified
 * - 3.3.2 Labels or Instructions: Form controls have labels
 * - 4.1.3 Status Messages: Status changes are announced
 *
 * @example
 * ```tsx
 * <GitHubUrlInput
 *   onAnalyze={(content, file) => handleAnalysis(content, file)}
 *   onFilesFound={(files) => setAvailableFiles(files)}
 * />
 * ```
 */
interface GitHubUrlInputProps {
  /**
   * Callback fired when analysis should begin with downloaded file content.
   * @param content - The file content as string
   * @param file - The dependency file that was downloaded
   * @accessibility Should announce successful analysis start
   */
  onAnalyze: (content: string, file: DependencyFile) => void;

  /**
   * Callback fired when multiple dependency files are found.
   * @param files - Array of discovered dependency files
   * @accessibility Should announce discovery and need for user selection
   */
  onFilesFound?: (files: DependencyFile[]) => void;

  /**
   * Whether analysis is currently in progress.
   * @accessibility Loading state should be announced and input should be disabled
   */
  isAnalyzing?: boolean;
}

export function GitHubUrlInput({
  onAnalyze,
  onFilesFound,
  isAnalyzing = false,
}: GitHubUrlInputProps) {
  const [url, setUrl] = useState("");
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    error?: string;
  }>({ isValid: false });
  const [showValidation, setShowValidation] = useState(false);

  const {
    searchRepository,
    downloadFile,
    isLoading,
    error: repoError,
    availableFiles,
    selectedFile,
    repoData,
    progress,
    reset,
    setSelectedFile,
  } = useGitHubRepository({
    onFilesDiscovered: (files) => {
      onFilesFound?.(files);
      // If only one file found, auto-select it
      if (files.length === 1) {
        setSelectedFile(files[0]);
      }
    },
    onFileDownloaded: (content, file) => {
      onAnalyze(content, file);
    },
  });

  // Real-time URL validation using centralized utility
  const validateUrl = useCallback((inputUrl: string) => {
    const validation = validateGitHubUrl(inputUrl);
    setValidationResult(validation);
    return validation;
  }, []);

  // Handle URL input changes
  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newUrl = e.target.value;
      setUrl(newUrl);

      // Show validation feedback after user starts typing
      if (newUrl.length > 0) {
        setShowValidation(true);
        validateUrl(newUrl);
      } else {
        setShowValidation(false);
        setValidationResult({ isValid: false });
      }

      // Reset repository state when URL changes
      if (repoData || availableFiles.length > 0) {
        reset();
      }
    },
    [validateUrl, repoData, availableFiles.length, reset]
  );

  // Handle search button click
  const handleSearch = useCallback(async () => {
    if (!url.trim()) return;

    const validation = validateUrl(url);
    if (!validation.isValid) {
      setShowValidation(true);
      return;
    }

    await searchRepository(url);
  }, [url, validateUrl, searchRepository]);

  // Handle file selection for download
  const handleFileSelect = useCallback(
    async (file: DependencyFile) => {
      try {
        setSelectedFile(file);
        await downloadFile(file);
      } catch (error) {
        // Error is handled by the hook
        console.error("Failed to download file:", error);
      }
    },
    [downloadFile, setSelectedFile]
  );

  // Handle clear input
  const handleClear = useCallback(() => {
    setUrl("");
    setValidationResult({ isValid: false });
    setShowValidation(false);
    reset();
  }, [reset]);

  // Handle Enter key press
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && validationResult.isValid && !isLoading) {
        handleSearch();
      }
    },
    [validationResult.isValid, isLoading, handleSearch]
  );

  const canSearch = validationResult.isValid && !isLoading && !isAnalyzing;
  const hasFiles = availableFiles.length > 0;
  const showProgress = isLoading && progress.stage !== "idle";

  return (
    <div className="space-y-4">
      {/* URL Input Section */}
      <div className="space-y-3">
        <Label
          htmlFor="github-url"
          className="text-sm sm:text-base font-medium"
        >
          GitHub Repository URL
        </Label>

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            <Github className="w-4 h-4 text-muted-foreground" />
          </div>

          <Input
            id="github-url"
            type="url"
            value={url}
            onChange={handleUrlChange}
            onKeyPress={handleKeyPress}
            placeholder="https://github.com/owner/repository"
            className={`pl-10 pr-10 h-12 text-sm sm:text-base ${showValidation
                ? validationResult.isValid
                  ? "border-green-300 bg-green-50/20 dark:border-green-700 dark:bg-green-950/10"
                  : "border-red-300 bg-red-50/20 dark:border-red-700 dark:bg-red-950/10"
                : ""
              }`}
            disabled={isLoading || isAnalyzing}
            aria-invalid={showValidation && !validationResult.isValid}
            aria-describedby={
              showValidation && validationResult.error ? "url-error" : undefined
            }
          />

          {url && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
              onClick={handleClear}
              disabled={isLoading || isAnalyzing}
            >
              <X className="w-4 h-4" />
            </Button>
          )}

          {showValidation && validationResult.isValid && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2">
              <CheckCircle2
                className="w-4 h-4 text-green-600 dark:text-green-400"
                data-testid="check-circle"
              />
            </div>
          )}
        </div>

        {/* URL Validation Error */}
        {showValidation && validationResult.error && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription id="url-error" className="text-sm">
              {validationResult.error}
            </AlertDescription>
          </Alert>
        )}

        {/* URL Preview */}
        {validationResult.isValid && repoData && (
          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border">
            <Github className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {repoData.owner}/{repoData.repo}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 ml-auto"
              onClick={() =>
                window.open(repoData.url, "_blank", "noopener,noreferrer")
              }
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        disabled={!canSearch}
        className="w-full h-12 text-base font-medium"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {progress.message || "Searching..."}
          </>
        ) : (
          <>
            <span className="hidden sm:inline">Search Dependency Files</span>
            <span className="sm:hidden">Search Files</span>
            <Search className="w-5 h-5 mr-2" />
          </>
        )}
      </Button>

      {/* Progress Indicator */}
      {showProgress && (
        <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
            <div className="flex-1">
              <p className="font-medium text-blue-900 dark:text-blue-100 text-sm">
                {progress.message}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Please wait while we analyze the repository
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Repository Error */}
      {repoError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{repoError}</AlertDescription>
        </Alert>
      )}

      {/* Found Files Section */}
      {hasFiles && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">
              <span className="hidden sm:inline">Dependency Files Found</span>
              <span className="sm:hidden">Files Found</span>
            </Label>
            <Badge variant="secondary" className="text-xs">
              {availableFiles.length} file
              {availableFiles.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          <div className="space-y-2">
            {availableFiles.map((file) => (
              <div
                key={file.path}
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg border transition-all ${selectedFile?.path === file.path
                    ? "border-primary bg-primary/5"
                    : "border-muted bg-muted/20 hover:bg-muted/30"
                  }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                    <Github className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB • {file.type}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleFileSelect(file)}
                  disabled={isLoading || isAnalyzing}
                  size="sm"
                  variant={
                    selectedFile?.path === file.path ? "default" : "outline"
                  }
                  className="w-full sm:w-auto"
                >
                  {isLoading && selectedFile?.path === file.path ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      <span className="hidden sm:inline">Downloading...</span>
                      <span className="sm:hidden">Loading...</span>
                    </>
                  ) : (
                    "Analyze"
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
