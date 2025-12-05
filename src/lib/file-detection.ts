import { detectFileType } from "@/lib/parsers";

/**
 * Detects the file type from content string.
 * Returns null if content is empty, a file is already selected, or detection fails.
 * 
 * @param content - The file content to analyze
 * @param selectedFile - Currently selected file (if any)
 * @returns Detected file type or null
 */
export function detectFileTypeFromContent(
    content: string,
    selectedFile: File | null
): string | null {
    if (!content.trim() || selectedFile) return null;

    try {
        const detected = detectFileType(content);
        return detected.kind;
    } catch (error) {
        console.log("[FileDetection] Detection failed:", error);
        return null;
    }
}
