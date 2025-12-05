interface UpdatePreviewProps {
  content: string;
  show: boolean;
}

export function UpdatePreview({ content, show }: UpdatePreviewProps) {
  if (!show) return null;

  return (
    <div className="bg-white/50 dark:bg-muted/50 backdrop-blur-sm rounded-lg p-4 mb-4 border border-gray-200 dark:border-muted">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Preview of updated file:
        </h4>
      </div>
      <pre className="bg-gray-900 dark:bg-black text-gray-100 dark:text-gray-200 p-3 sm:p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-48 sm:max-h-64 overflow-y-auto border border-gray-700 dark:border-muted shadow-inner">
        {content}
      </pre>
    </div>
  );
}
