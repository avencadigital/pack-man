import { Checkbox } from "@/components/ui/checkbox";

interface UpdateOptionsProps {
  updateMajor: boolean;
  updateMinor: boolean;
  updatePatch: boolean;
  onUpdateMajorChange: (checked: boolean) => void;
  onUpdateMinorChange: (checked: boolean) => void;
  onUpdatePatchChange: (checked: boolean) => void;
  majorCount: number;
  minorCount: number;
  patchCount: number;
}

export function UpdateOptions({
  updateMajor,
  updateMinor,
  updatePatch,
  onUpdateMajorChange,
  onUpdateMinorChange,
  onUpdatePatchChange,
  majorCount,
  minorCount,
  patchCount,
}: UpdateOptionsProps) {
  return (
    <div className="bg-white/50 dark:bg-muted/50 backdrop-blur-sm rounded-lg p-4 mb-6 border border-gray-200 dark:border-muted">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Select update types:
      </h4>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
        <div className="flex items-center space-x-3 px-6 py-4 rounded-lg bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-gray-800/50 transition-colors">
          <Checkbox
            id="major"
            checked={updateMajor}
            onCheckedChange={(checked) => onUpdateMajorChange(!!checked)}
            className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
          />
          <label
            htmlFor="major"
            className="text-sm font-medium cursor-pointer text-gray-900 dark:text-gray-100 flex items-center gap-2"
          >
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Major ({majorCount})
          </label>
        </div>
        <div className="flex items-center space-x-3 px-6 py-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 hover:bg-yellow-100 dark:hover:bg-gray-800/50 transition-colors">
          <Checkbox
            id="minor"
            checked={updateMinor}
            onCheckedChange={(checked) => onUpdateMinorChange(!!checked)}
            className="data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600"
          />
          <label
            htmlFor="minor"
            className="text-sm font-medium cursor-pointer text-gray-900 dark:text-gray-100 flex items-center gap-2"
          >
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            Minor ({minorCount})
          </label>
        </div>
        <div className="flex items-center space-x-3 px-6 py-4 rounded-lg bg-green-50 hover:bg-green-100 dark:bg-green-950/30 dark:hover:bg-gray-800/50 transition-colors">
          <Checkbox
            id="patch"
            checked={updatePatch}
            onCheckedChange={(checked) => onUpdatePatchChange(!!checked)}
            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <label
            htmlFor="patch"
            className="text-sm font-medium cursor-pointer text-gray-900 dark:text-gray-100 flex items-center gap-2"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Patch ({patchCount})
          </label>
        </div>
      </div>
    </div>
  );
}
