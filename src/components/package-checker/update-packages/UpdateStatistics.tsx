interface UpdateStatisticsProps {
  major: number;
  minor: number;
  patch: number;
}

export function UpdateStatistics({
  major,
  minor,
  patch,
}: UpdateStatisticsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
      <div className="bg-white dark:bg-muted backdrop-blur-sm rounded-lg border border-red-100 dark:border-red-900/40 p-3 sm:p-4 text-center hover:shadow-md transition-all duration-200">
        <div className="text-xl sm:text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
          {major}
        </div>
        <div className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-300">
          Major
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Breaking changes
        </div>
      </div>
      <div className="bg-white dark:bg-muted backdrop-blur-sm rounded-lg border border-yellow-100 dark:border-yellow-900/40 p-3 sm:p-4 text-center hover:shadow-md transition-all duration-200">
        <div className="text-xl sm:text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
          {minor}
        </div>
        <div className="text-xs sm:text-sm font-medium text-yellow-700 dark:text-yellow-300">
          Minor
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          New features
        </div>
      </div>
      <div className="bg-white dark:bg-muted backdrop-blur-sm rounded-lg border border-green-100 dark:border-green-900/40 p-3 sm:p-4 text-center hover:shadow-md transition-all duration-200">
        <div className="text-xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
          {patch}
        </div>
        <div className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300">
          Patch
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Bug fixes
        </div>
      </div>
    </div>
  );
}
