"use client";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2Icon,
  Clock,
  ArrowUpRight,
  Package,
  GitBranch,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PackageInfo } from "@/types/package";
import { getPackageUrl, getStatusColor } from "@/lib/package";
import { ExternalLink, TrendingUp } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Props for the PackageCard component with comprehensive accessibility support.
 *
 * @interface PackageCardProps
 * @description Defines the interface for displaying individual package information
 * in a card format. Each card presents package details with clear visual hierarchy
 * and accessible status indicators.
 *
 * @accessibility
 * - Status should be conveyed through multiple channels (color, icon, text)
 * - External links should be clearly marked and have descriptive labels
 * - Version information should be clearly structured and readable
 * - Interactive elements should have proper focus indicators
 * - Package manager badges should have meaningful labels
 *
 * @wcag
 * - 1.4.1 Use of Color: Status not conveyed by color alone
 * - 1.4.3 Contrast: Sufficient color contrast for text and backgrounds
 * - 2.4.4 Link Purpose: Link purpose clear from link text or context
 * - 3.2.4 Consistent Identification: Consistent identification of components
 *
 * @example
 * `	sx
 * <PackageCard
 *   pkg={{
 *     name: "react",
 *     currentVersion: "18.0.0",
 *     latestVersion: "18.2.0",
 *     status: "outdated",
 *     packageManager: "npm",
 *     homepage: "https://reactjs.org",
 *     description: "A JavaScript library for building user interfaces"
 *   }}
 * />
 * `
 */
interface PackageCardProps {
  /**
   * Package information object containing all display data.
   * @accessibility
   * - Package name should be the primary heading/identifier
   * - Status should be clearly indicated with icon, color, and text
   * - Version comparison should be easy to understand
   * - Homepage links should open in new tab with proper ARIA labels
   * - Description should be concise and informative
   * - Package manager should be visually distinct but not rely on color alone
   */
  pkg: PackageInfo;
}

// Status configuration objects
const statusConfig = {
  "up-to-date": {
    icon: CheckCircle2Icon,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-500",
    badgeClass:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800",
    label: "Up to date",
  },
  outdated: {
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500",
    badgeClass:
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800",
    label: "Update available",
  },
  error: {
    icon: AlertTriangle,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-500",
    badgeClass:
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800",
    label: "Error",
  },
};

export function PackageCard({ pkg }: PackageCardProps) {
  const packageUrl = getPackageUrl(pkg);
  const statusInfo = statusConfig[pkg.status] || statusConfig.error;
  const StatusIcon = statusInfo.icon;

  const packageManagerConfig = {
    npm: { icon: "/logos/npm-square.svg", label: "" },
    pip: { icon: "/logos/pypi.svg", label: "" },
    pub: { icon: "/logos/pub.svg", label: "" },
  };

  const pmConfig =
    packageManagerConfig[
      pkg.packageManager as keyof typeof packageManagerConfig
    ];

  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
      {/* Status indicator bar at the top */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1 transition-all duration-300",
          statusInfo.bgColor
        )}
      />

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3 mb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 min-w-0 flex-1">
            <Package className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <a
              href={packageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors duration-200 flex items-center gap-1 group/link min-w-0"
              aria-label={`Open ${pkg.name} package page`}
            >
              <span className="truncate">{pkg.name}</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200 flex-shrink-0" />
            </a>
          </CardTitle>
          <Badge className={cn(statusInfo.bgColor, "text-white flex-shrink-0")}>
            {statusInfo.label}
          </Badge>
        </div>

        {/* Package manager and version badges */}
        <div className="flex gap-2 mb-3 flex-wrap items-center">
          {pmConfig && (
            <Image
              src={pmConfig.icon}
              alt={`${pkg.packageManager} logo`}
              width={24}
              height={24}
              className="w-6 h-6 flex-shrink-0"
            />
          )}
          <Badge
            variant="outline"
            className={cn("text-xs flex-shrink-0", statusInfo.badgeClass)}
          >
            <StatusIcon className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="whitespace-nowrap">
              {pkg.status === "outdated" ? "Update Required" : statusInfo.label}
            </span>
          </Badge>
        </div>

        {pkg.description && (
          <CardDescription className="text-sm text-muted-foreground line-clamp-2">
            {pkg.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-grow space-y-3">
        {/* Version information with improved layout */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <GitBranch className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground whitespace-nowrap">Current</span>
            </div>
            <code className="px-2 py-1 bg-muted rounded-md font-mono text-xs font-medium truncate max-w-[150px]" title={pkg.currentVersion}>
              {pkg.currentVersion}
            </code>
          </div>

          {pkg.status === "outdated" && pkg.latestVersion && (
            <div className="flex items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <TrendingUp className="w-3 h-3 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <span className="text-muted-foreground whitespace-nowrap">Latest</span>
              </div>
              <code className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-md font-mono text-xs font-medium truncate max-w-[150px]" title={pkg.latestVersion}>
                {pkg.latestVersion}
              </code>
            </div>
          )}
        </div>

        {/* Additional metadata */}
        {pkg.homepage && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Info className="w-3 h-3 mr-1" />
            <a
              href={pkg.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors truncate"
            >
              Homepage
            </a>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3">
        <Button variant="outline" className="w-full group/btn" asChild>
          <a
            href={packageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            <Package className="w-4 h-4 mr-2 text-muted-foreground group-hover/btn:text-primary transition-colors" />
            <span className="text-muted-foreground group-hover/btn:text-primary transition-colors">
              View on {pkg.packageManager}
            </span>
            <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
