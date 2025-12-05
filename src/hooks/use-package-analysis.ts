"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PackageInfo, AnalysisSummary } from "@/types/package";

/**
 * Props for the usePackageAnalysis hook with accessibility considerations.
 * 
 * @interface UsePackageAnalysisProps
 * @description Defines the callback interface for the package analysis hook.
 * Callbacks should handle accessibility announcements and error communication
 * appropriately for screen reader users.
 * 
 * @accessibility
 * - Analysis completion should be announced to screen readers
 * - Progress updates should not overwhelm assistive technology
 * - Error messages should be clear, actionable, and immediately announced
 * - Success states should provide meaningful feedback
 * 
 * @wcag
 * - 3.3.1 Error Identification: Errors are clearly identified and described
 * - 3.3.3 Error Suggestion: Error messages provide suggestions when possible
 * - 4.1.3 Status Messages: Important status changes are announced
 * 
 * @example
 * `	sx
 * const { analyzePackages } = usePackageAnalysis({
 *   onAnalysisComplete: (results, summary) => {
 *     // Announce completion: "Analysis complete. Found X packages, Y need updates"
 *     setResults(results);
 *     setSummary(summary);
 *   },
 *   onError: (error) => {
 *     // Announce error immediately: "Analysis failed: [error message]"
 *     setError(error);
 *   }
 * });
 * `
 */
interface UsePackageAnalysisProps {
  /** 
   * Callback fired when package analysis completes successfully.
   * @param results - Array of analyzed package information
   * @param summary - Statistical summary of the analysis
   * @accessibility 
   * - Should announce completion with summary statistics
   * - Consider announcing number of packages that need attention
   * - Avoid overwhelming users with too much detail in announcement
   */
  onAnalysisComplete: (results: PackageInfo[], summary: AnalysisSummary) => void;
  
  /** 
   * Callback fired when package analysis encounters an error.
   * @param error - Human-readable error message
   * @accessibility 
   * - Error should be announced immediately via aria-live region
   * - Message should be clear and actionable when possible
   * - Should not use technical jargon that confuses users
   */
  onError: (error: string) => void;
}

/**
 * Estimates the number of packages in the content for progress calculation.
 * This provides a rough estimate based on file patterns.
 */
function estimatePackageCount(content: string, fileName: string): number {
  const lowerFileName = fileName?.toLowerCase() || "";
  let count = 0;

  try {
    if (lowerFileName.includes('package.json') || content.trim().startsWith('{')) {
      // Count dependencies in package.json
      const parsed = JSON.parse(content);
      count = Object.keys(parsed.dependencies || {}).length +
              Object.keys(parsed.devDependencies || {}).length;
    } else if (lowerFileName.includes('requirements.txt') || lowerFileName.endsWith('.txt')) {
      // Count non-empty, non-comment lines
      const lines = content.split('\n').filter(line => {
        const trimmed = line.trim();
        return trimmed &&
               !trimmed.startsWith('#') &&
               !trimmed.startsWith('-r') &&
               !trimmed.startsWith('-e');
      });
      count = lines.length;
    } else if (lowerFileName.includes('pubspec')) {
      // Count dependencies in YAML
      const dependencyMatches = content.match(/^\s+[a-zA-Z0-9_-]+:/gm) || [];
      count = dependencyMatches.length;
    }
  } catch {
    // If parsing fails, use a default estimate
    const lines = content.split('\n').filter(l => l.trim()).length;
    count = Math.max(Math.floor(lines / 2), 5);
  }

  return Math.max(count, 1); // At least 1 to avoid division by zero
}

export function usePackageAnalysis({ onAnalysisComplete, onError }: UsePackageAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const { toast } = useToast();

  const analyzePackages = async (content: string, fileName: string) => {
    if (!content.trim()) {
      onError("Please provide file content");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Calculate estimated number of packages for realistic progress
      // This gives better UX than fake progress
      const estimatedPackages = estimatePackageCount(content, fileName);
      const progressIncrement = estimatedPackages > 0 ? 80 / estimatedPackages : 10;

      // Start with initial progress (file parsing)
      setAnalysisProgress(10);

      // Gradual progress increment during fetch
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          // Stop at 90% until we get response
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return Math.min(prev + progressIncrement, 90);
        });
      }, Math.max(200, 5000 / (estimatedPackages || 10))); // Adaptive timing

      const response = await fetch("/api/analyze-packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          fileName,
        }),
      });

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      if (!response.ok) {
        throw new Error("Error analyzing packages");
      }

      const data = await response.json();
      
      if (data.packages?.length === 0) {
        onError("No packages found in file");
      } else {
        onAnalysisComplete(data.packages || [], data.summary || null);
        toast({
          title: "Analysis completed",
          description: `Found ${data.packages?.length || 0} packages`,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      onError(errorMessage);
      toast({
        title: "Analysis error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisProgress(0);
      }, 500);
    }
  };

  return {
    isAnalyzing,
    analysisProgress,
    analyzePackages,
  };
}
