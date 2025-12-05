import { Badge } from "@/components/ui/badge";

interface UpdatePackagesHeaderProps {
  totalOutdated: number;
  packagesToUpdateCount: number;
}

export function UpdatePackagesHeader({
  totalOutdated,
  packagesToUpdateCount,
}: UpdatePackagesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
          Update Packages
        </h3>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          className="text-xs bg-orange-50 border-orange-200 text-orange-700 dark:bg-gray-800/50 dark:border-gray-700 dark:text-orange-300 p-3 rounded-2xl"
        >
          {totalOutdated} outdated
        </Badge>
        <Badge
          variant="secondary"
          className="text-xs bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-300  p-3 rounded-2xl"
        >
          {packagesToUpdateCount} will be updated
        </Badge>
      </div>
    </div>
  );
}
