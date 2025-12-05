import { PackageInfo } from "@/types/package";

/**
 * Gets the appropriate CSS classes for a package status
 * @param status - Package status
 * @returns CSS class string for styling
 * @deprecated Consider using status-specific components instead
 * 
 * @example
 * getStatusColor("up-to-date") 
 * // "bg-green-100 text-green-800 border-green-200"
 */
export function getStatusColor(status: PackageInfo["status"]): string {
  switch (status) {
    case "up-to-date":
      return "bg-green-100 text-green-800 border-green-200";
    case "outdated":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "error":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

/**
 * Status configuration for package cards
 * Provides consistent styling and labeling for package statuses
 */
export const STATUS_CONFIG = {
  "up-to-date": {
    label: "Up to date",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-500",
    badgeClass: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800",
  },
  outdated: {
    label: "Update available",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500",
    badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800",
  },
  error: {
    label: "Error",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-500",
    badgeClass: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800",
  },
} as const;
