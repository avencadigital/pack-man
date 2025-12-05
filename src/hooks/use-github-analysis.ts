import { useCallback } from "react";
import { DependencyFile } from "@/types/github";

/**
 * Custom hook for handling GitHub URL analysis with fallback logic.
 * 
 * @param onDirectAnalyze - Direct analysis function (preferred)
 * @param onFileContentChange - Fallback: Update file content
 * @param onFileSelect - Fallback: Select virtual file
 * @param onAnalyze - Fallback: Trigger analysis
 * @returns Callback function to handle GitHub analysis
 */
export function useGitHubAnalysis(
    onDirectAnalyze?: (content: string, fileName: string) => void,
    onFileContentChange?: (content: string) => void,
    onFileSelect?: (file: File | null) => void,
    onAnalyze?: () => void
) {
    return useCallback(
        (content: string, file: DependencyFile) => {
            // Ensure content is a string and not empty
            const stringContent =
                typeof content === "string" ? content : String(content);

            if (!stringContent || stringContent.trim().length === 0) {
                return;
            }

            // If we have a direct analyze function, use it
            if (onDirectAnalyze) {
                onDirectAnalyze(stringContent, file.name);
            } else {
                // Fallback to the old method
                if (onFileContentChange) {
                    onFileContentChange(stringContent);
                }

                // Create a virtual file object for consistency
                if (onFileSelect) {
                    const virtualFile = new File([stringContent], file.name, {
                        type:
                            file.type === "package.json" ? "application/json" : "text/plain",
                    });
                    onFileSelect(virtualFile);
                }

                // Trigger analysis after a short delay
                if (onAnalyze) {
                    setTimeout(() => {
                        onAnalyze();
                    }, 100);
                }
            }
        },
        [onDirectAnalyze, onFileContentChange, onFileSelect, onAnalyze]
    );
}
