import { Button } from "@/components/ui/button";
import { Copy, Download, Info } from "lucide-react";

interface UpdateActionsProps {
  onCopy: () => void;
  onDownload: () => void;
  onTogglePreview: () => void;
  disabled: boolean;
  showPreview: boolean;
}

export function UpdateActions({
  onCopy,
  onDownload,
  onTogglePreview,
  disabled,
  showPreview,
}: UpdateActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <Button
        onClick={onCopy}
        disabled={disabled}
        className="flex items-center justify-center space-x-2 w-full sm:w-auto  border-gray-300 dark:border-gray-700 hover:bg-gray-600
        dark:hover:bg-gray-400 shadow-sm transition-all duration-200 hover:shadow-md"
        size="lg"
      >
        <Copy className="h-4 w-4" />
        <span className="hidden xs:inline">Copy Updated File</span>
        <span className="xs:hidden">Copy</span>
      </Button>

      <Button
        onClick={onDownload}
        disabled={disabled}
        className="flex items-center justify-center space-x-2 w-full sm:w-auto  border-gray-300 dark:border-gray-700 hover:bg-gray-600
        dark:hover:bg-gray-400 shadow-sm transition-all duration-200 hover:shadow-md"
        size="lg"
      >
        <Download className="h-6 w-6" />
        <span>Download</span>
      </Button>

      <Button
        variant="ghost"
        onClick={onTogglePreview}
        className="flex items-center justify-center space-x-2 w-full sm:w-auto hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-200"
        size="default"
      >
        <Info className="h-4 w-4" />
        <span>{showPreview ? "Hide" : "Show"} Preview</span>
      </Button>
    </div>
  );
}
