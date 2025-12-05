"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AnalysisSummary } from "@/types/package";

/**
 * Props for the AnalysisStats component with accessibility-first design.
 *
 * @interface AnalysisStatsProps
 * @description Defines the interface for displaying package analysis statistics
 * in a visually appealing and accessible grid format. Statistics are presented
 * with clear numerical values and contextual labels.
 *
 * @accessibility
 * - Statistics should be announced with proper context and units
 * - Color coding should be supplemented with clear textual labels
 * - Numbers should be formatted consistently and be screen reader friendly
 * - Grid layout should maintain logical reading order
 * - Each statistic should have a clear relationship between number and label
 *
 * @wcag
 * - 1.3.1 Info and Relationships: Statistical relationships are clear
 * - 1.3.2 Meaningful Sequence: Reading order is logical
 * - 1.4.1 Use of Color: Information not conveyed by color alone
 * - 2.4.6 Headings and Labels: Statistics have descriptive labels
 *
 * @example
 * `	sx
 * <AnalysisStats
 *   summary={{
 *     total: 25,
 *     upToDate: 20,
 *     outdated: 4,
 *     errors: 1
 *   }}
 * />
 * `
 */
interface AnalysisStatsProps {
  /**
   * Analysis summary data containing statistical counts.
   * @accessibility
   * - Each statistic should be announced as "X [label]" (e.g., "25 total packages")
   * - Color associations should be consistent with status meanings
   * - Zero values should still be clearly presented
   * - Large numbers should be formatted appropriately (e.g., 1,000+ packages)
   */
  summary: AnalysisSummary;
}

export function AnalysisStats({ summary }: AnalysisStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
          {summary.total}
        </div>
        <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium">
          Total
        </div>
      </div>
      <div className="text-center p-3 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800">
        <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
          {summary.upToDate}
        </div>
        <div className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">
          Up to Date
        </div>
      </div>
      <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/50 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div className="text-2xl sm:text-3xl font-bold text-yellow-600 dark:text-yellow-400">
          {summary.outdated}
        </div>
        <div className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-400 font-medium">
          Outdated
        </div>
      </div>
      <div className="text-center p-3 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-800">
        <div className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">
          {summary.errors}
        </div>
        <div className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">
          Errors
        </div>
      </div>
    </div>
  );
}
