"use client";

import { PackageInfo } from "@/types/package";
import { usePackageUpdates } from "@/hooks/use-package-updates";
import {
  UpdatePackagesHeader,
  UpdateStatistics,
  UpdateOptions,
  UpdateAlerts,
  UpdateActions,
  UpdatePreview,
  PackageUpdatesList,
} from "./update-packages";

interface UpdatePackagesProps {
  originalContent: string;
  packages: PackageInfo[];
  fileName: string;
}

export function UpdatePackages({
  originalContent,
  packages,
  fileName,
}: UpdatePackagesProps) {
  const {
    updateMajor,
    updateMinor,
    updatePatch,
    showPreview,
    updateStats,
    packagesToUpdate,
    updatedContent,
    setUpdateMajor,
    setUpdateMinor,
    setUpdatePatch,
    handleCopy,
    handleDownload,
    togglePreview,
  } = usePackageUpdates(packages, originalContent, fileName);

  return (
    <div className="p-4 sm:p-6 border border-gray-200 dark:border-muted rounded-xl bg-muted/50 shadow-sm mb-6">
      <UpdatePackagesHeader
        totalOutdated={updateStats.total}
        packagesToUpdateCount={packagesToUpdate.length}
      />

      <UpdateStatistics
        major={updateStats.major}
        minor={updateStats.minor}
        patch={updateStats.patch}
      />

      <UpdateOptions
        updateMajor={updateMajor}
        updateMinor={updateMinor}
        updatePatch={updatePatch}
        onUpdateMajorChange={setUpdateMajor}
        onUpdateMinorChange={setUpdateMinor}
        onUpdatePatchChange={setUpdatePatch}
        majorCount={updateStats.major}
        minorCount={updateStats.minor}
        patchCount={updateStats.patch}
      />

      <UpdateAlerts
        showMajorWarning={updateMajor}
        showNoUpdatesAlert={packagesToUpdate.length === 0}
      />

      <UpdateActions
        onCopy={handleCopy}
        onDownload={handleDownload}
        onTogglePreview={togglePreview}
        disabled={packagesToUpdate.length === 0}
        showPreview={showPreview}
      />

      <UpdatePreview content={updatedContent} show={showPreview} />

      <PackageUpdatesList packages={packagesToUpdate} />
    </div>
  );
}
