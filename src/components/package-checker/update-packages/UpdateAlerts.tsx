import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";

interface UpdateAlertsProps {
  showMajorWarning: boolean;
  showNoUpdatesAlert: boolean;
}

export function UpdateAlerts({
  showMajorWarning,
  showNoUpdatesAlert,
}: UpdateAlertsProps) {
  return (
    <>
      {showMajorWarning && (
        <Alert
          variant="destructive"
          className="my-10 border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30"
        >
          <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" />
          <div className="flex-1 min-w-0">
            <AlertTitle className="text-sm font-semibold text-red-800 dark:text-red-200">
              Warning - Major Updates
            </AlertTitle>
            <AlertDescription className="text-xs sm:text-sm text-red-700 dark:text-red-300">
              Major version updates may introduce breaking changes to your
              application. Test carefully after updating.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {showNoUpdatesAlert && (
        <Alert className="my-10 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
          <Info className="h-4 w-4 flex-shrink-0 text-gray-600 dark:text-gray-400" />
          <div className="flex-1 min-w-0">
            <AlertTitle className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              No packages will be updated
            </AlertTitle>
            <AlertDescription className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              With the selected options, no packages will be updated. Please
              select at least one update type.
            </AlertDescription>
          </div>
        </Alert>
      )}
    </>
  );
}
