"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Clipboard, Github } from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useDragDrop } from "@/hooks/use-drag-drop";
import { useGitHubAnalysis } from "@/hooks/use-github-analysis";
import { detectFileTypeFromContent } from "@/lib/file-detection";
import { GitHubUrlInput } from "./GitHubUrlInput";
import { FileUploadTab, ManualInputTab } from "./upload-tabs";
import { AnalysisStatusIndicator } from "./AnalysisStatusIndicator";
import { AnalyzeButton } from "./AnalyzeButton";
import { AnalysisErrorAlert } from "./AnalysisErrorAlert";

/**
 * Props for the FileUploadSection component with accessibility considerations.
 *
 * @interface FileUploadSectionProps
 * @description Defines the interface for a dual-mode file upload component that supports
 * both file upload and manual text input. Designed with accessibility in mind including
 * proper ARIA labels, keyboard navigation, and screen reader support.
 *
 * @accessibility
 * - File input should have proper labels and accept attributes
 * - Progress indicators must be announced to screen readers
 * - Error messages should be associated with relevant form controls
 * - Tab navigation should be logical and keyboard accessible
 * - Loading states should be clearly communicated
 *
 * @wcag
 * - 2.1.1 Keyboard: All functionality available via keyboard
 * - 3.3.1 Error Identification: Errors are clearly identified
 * - 3.3.2 Labels or Instructions: Form controls have labels
 * - 4.1.3 Status Messages: Status changes are announced
 *
 * @example
 * ```tsx
 * <FileUploadSection
 *   fileContent={content}
 *   selectedFile={file}
 *   onFileContentChange={setContent}
 *   onFileSelect={setFile}
 *   onAnalyze={handleAnalyze}
 *   isAnalyzing={false}
 *   analysisProgress={0}
 *   error={null}
 * />
 * ```
 */
interface FileUploadSectionProps {
  /**
   * Current text content of the file or manual input.
   * @accessibility Should be properly associated with textarea via labels
   */
  fileContent: string;

  /**
   * Currently selected file object, null if none selected.
   * @accessibility File selection should be announced to screen readers
   */
  selectedFile: File | null;

  /**
   * Callback fired when file content changes (manual input or file upload).
   * @param content - New content string
   * @accessibility Content changes should not interrupt screen reader flow
   */
  onFileContentChange: (content: string) => void;

  /**
   * Callback fired when a file is selected or deselected.
   * @param file - Selected file object or null
   * @accessibility File selection should be announced with file name and size
   */
  onFileSelect: (file: File | null) => void;

  /**
   * Callback fired when the analyze button is clicked.
   * @accessibility Should be clearly labeled and indicate what action will occur
   */
  onAnalyze: () => void;

  /**
   * Direct analyze function for GitHub URL analysis.
   * @param content - File content to analyze
   * @param fileName - Name of the file
   */
  onDirectAnalyze?: (content: string, fileName: string) => void;

  /**
   * Whether analysis is currently in progress.
   * @accessibility Loading state should be announced and button should be disabled
   */
  isAnalyzing: boolean;

  /**
   * Current analysis progress as a percentage (0-100).
   * @accessibility Progress should be announced periodically, not on every change
   */
  analysisProgress: number;

  /**
   * Error message to display, null if no error.
   * @accessibility Errors should be announced immediately and associated with relevant controls
   */
  error: string | null;
}

export function FileUploadSection({
  fileContent,
  selectedFile,
  onFileContentChange,
  onFileSelect,
  onAnalyze,
  onDirectAnalyze,
  isAnalyzing,
  analysisProgress,
  error,
}: FileUploadSectionProps) {
  const [activeTab, setActiveTab] = useState("upload");
  const { handleFileUpload } = useFileUpload({
    onFileContentChange,
    onFileSelect,
  });

  // Drag and drop functionality
  const { dragActive, handleDrag, handleDrop } = useDragDrop((file) => {
    const event = {
      target: { files: [file] },
    } as any;
    handleFileUpload(event);
  });

  // GitHub analysis handler
  const handleGitHubAnalyze = useGitHubAnalysis(
    onDirectAnalyze,
    onFileContentChange,
    onFileSelect,
    onAnalyze
  );

  const clearFile = () => {
    onFileSelect(null);
    onFileContentChange("");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Clear content when switching tabs to avoid confusion
    if (fileContent || selectedFile) {
      clearFile();
    }
  };

  const hasContent = fileContent.trim().length > 0;
  const canAnalyze = hasContent && !isAnalyzing;

  // Detect file type from pasted content
  const detectedType = detectFileTypeFromContent(fileContent, selectedFile);

  return (
    <div className="space-y-4 sm:space-y-6">
      <Tabs
        defaultValue="upload"
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 h-12 sm:h-14 bg-muted dark:bg-muted/50 rounded-full p-1.5">
          <TabsTrigger
            value="upload"
            className="flex items-center justify-center gap-2 text-xs sm:text-sm h-full rounded-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground transition-all"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">File Upload</span>
            <span className="sm:hidden">Upload</span>
          </TabsTrigger>
          <TabsTrigger
            value="manual"
            className="flex items-center justify-center gap-2 text-xs sm:text-sm h-full rounded-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground transition-all"
          >
            <Clipboard className="w-4 h-4" />
            <span className="hidden sm:inline">Paste Content</span>
            <span className="sm:hidden">Paste</span>
          </TabsTrigger>
          <TabsTrigger
            value="github"
            className="flex items-center justify-center gap-2 text-xs sm:text-sm h-full rounded-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground transition-all"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub URL</span>
            <span className="sm:hidden">GitHub</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="upload"
          className="space-y-3 sm:space-y-4 mt-4 sm:mt-6"
        >
          <FileUploadTab
            selectedFile={selectedFile}
            dragActive={dragActive}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onFileChange={handleFileUpload}
            onClearFile={clearFile}
          />
        </TabsContent>

        <TabsContent
          value="manual"
          className="space-y-3 sm:space-y-4 mt-4 sm:mt-6"
        >
          <ManualInputTab
            fileContent={fileContent}
            detectedType={detectedType}
            onContentChange={onFileContentChange}
          />
        </TabsContent>

        <TabsContent
          value="github"
          className="space-y-3 sm:space-y-4 mt-4 sm:mt-6"
        >
          <GitHubUrlInput
            onAnalyze={handleGitHubAnalyze}
            isAnalyzing={isAnalyzing}
          />
        </TabsContent>
      </Tabs>

      {isAnalyzing && (
        <AnalysisStatusIndicator analysisProgress={analysisProgress} />
      )}

      {/* Only show the analyze button for upload and manual tabs */}
      {activeTab !== "github" && (
        <AnalyzeButton
          onClick={onAnalyze}
          disabled={!canAnalyze}
          isAnalyzing={isAnalyzing}
        />
      )}

      {error && <AnalysisErrorAlert error={error} />}
    </div>
  );
}
