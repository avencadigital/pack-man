export const PACKAGE_STATUS = {
  UP_TO_DATE: 'up-to-date',
  OUTDATED: 'outdated',
  ERROR: 'error'
} as const;

export type PackageStatus = typeof PACKAGE_STATUS[keyof typeof PACKAGE_STATUS];

export interface PackageInfo {
  name: string;
  currentVersion: string;
  latestVersion: string;
  status: PackageStatus;
  packageManager: "npm" | "pip" | "pub";
  description?: string;
  homepage?: string;
  /** Error message if package fetch failed */
  error?: string;
}

export interface PackageAnalysisSummary {
  total: number;
  upToDate: number;
  outdated: number;
  errors: number;
}

export interface PackageAnalysisResponse {
  packages: PackageInfo[];
  summary: PackageAnalysisSummary;
}