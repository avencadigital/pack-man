import { PackageInfo } from "@/types/package";

interface PackageUpdatesListProps {
  packages: PackageInfo[];
}

export function PackageUpdatesList({ packages }: PackageUpdatesListProps) {
  if (packages.length === 0) return null;

  return (
    <div className="bg-white/50 dark:bg-muted/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-muted">
      <div className="flex items-center gap-2 mb-3">
      </div>
      <div className="space-y-2 max-h-80 sm:max-h-120 overflow-y-auto">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-muted dark:bg-muted p-6 rounded-2xl border border-gray-200 dark:border-muted hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full flex-shrink-0"></div>
              <span className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                {pkg.name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded font-mono">
                {pkg.currentVersion}
              </span>
              <span className="text-gray-400 dark:text-gray-500">→</span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 rounded font-mono">
                {pkg.latestVersion}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
