import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { PackageInfo } from "@/types/package";
import { generateUpdatedPackageFile } from "@/lib/generators";
import { cleanVersion } from "@/lib/formatters";
import { getChangeType } from "@/lib/package";
import { 
    detectFileType,
    getExtensionFromKind,
    getMimeFromKind
} from "@/lib/parsers";
import semver from "semver";

interface UpdateOptions {
    updateMajor: boolean;
    updateMinor: boolean;
    updatePatch: boolean;
}

interface UpdateStats {
    major: number;
    minor: number;
    patch: number;
    total: number;
}

export function usePackageUpdates(
    packages: PackageInfo[],
    originalContent: string,
    fileName: string
) {
    const [updateMajor, setUpdateMajor] = useState(false);
    const [updateMinor, setUpdateMinor] = useState(true);
    const [updatePatch, setUpdatePatch] = useState(true);
    const [showPreview, setShowPreview] = useState(false);
    const { toast } = useToast();

    // Calculate statistics of packages that will be updated
    const updateStats = useMemo((): UpdateStats => {
        const outdatedPackages = packages.filter(
            (pkg) => pkg.status === "outdated"
        );

        const stats = {
            major: 0,
            minor: 0,
            patch: 0,
            total: outdatedPackages.length,
        };

        outdatedPackages.forEach((pkg) => {
            const changeType = getChangeType(pkg.currentVersion, pkg.latestVersion);
            
            if (changeType === "major") stats.major++;
            else if (changeType === "minor") stats.minor++;
            else if (changeType === "patch") stats.patch++;
            // "none" and "error" types are ignored
        });

        return stats;
    }, [packages]);

    // Calculate how many packages will be updated with current options
    const packagesToUpdate = useMemo(() => {
        return packages.filter((pkg) => {
            if (pkg.status !== "outdated") return false;

            const changeType = getChangeType(pkg.currentVersion, pkg.latestVersion);
            
            if (changeType === "error" || changeType === "none") return false;
            
            // Check if should update based on options using mapping table
            const allow = {
                major: updateMajor,
                minor: updateMinor,
                patch: updatePatch,
            };
            
            return allow[changeType] || false;
        });
    }, [packages, updateMajor, updateMinor, updatePatch]);

    const updateOptions: UpdateOptions = {
        updateMajor,
        updateMinor,
        updatePatch,
    };

    const updatedContent = useMemo(() => {
        if (!showPreview) return "";
        return generateUpdatedPackageFile(
            originalContent,
            packages,
            updateOptions,
            fileName
        );
    }, [
        showPreview,
        originalContent,
        packages,
        updateMajor,
        updateMinor,
        updatePatch,
        fileName,
    ]);

    const handleCopy = () => {
        console.log("[HandleCopy] Starting copy with:", {
            packagesCount: packages.length,
            updateOptions,
            fileName,
            originalContentLength: originalContent.length,
            packagesToUpdateCount: packagesToUpdate.length
        });
        
        const content = generateUpdatedPackageFile(
            originalContent,
            packages,
            updateOptions,
            fileName
        );
        
        console.log("[HandleCopy] Generated content:", {
            contentLength: content.length,
            isChanged: content !== originalContent,
            firstLines: content.split('\n').slice(0, 5).join('\n')
        });

        navigator.clipboard
            .writeText(content)
            .then(() => {
                // Detect file type for better feedback
                const detected = detectFileType(originalContent, fileName);
                toast({
                    title: "Copied to clipboard",
                    description: `Updated ${detected.kind} with ${packagesToUpdate.length} packages copied successfully.`,
                });
            })
            .catch((err) => {
                console.error("Clipboard error:", err);
                toast({
                    title: "Error",
                    description: "Could not copy to clipboard.",
                    variant: "destructive",
                });
            });
    };

    const handleDownload = () => {
        console.log("[HandleDownload] Starting download with:", {
            packagesCount: packages.length,
            updateOptions,
            fileName,
            originalContentLength: originalContent.length,
            packagesToUpdateCount: packagesToUpdate.length
        });
        
        const content = generateUpdatedPackageFile(
            originalContent,
            packages,
            updateOptions,
            fileName
        );
        
        console.log("[HandleDownload] Generated content:", {
            contentLength: content.length,
            isChanged: content !== originalContent,
            firstLines: content.split('\n').slice(0, 5).join('\n')
        });

        // Detect file type to get correct extension and MIME type
        const detected = detectFileType(originalContent, fileName);
        const mimeType = getMimeFromKind(detected.kind);
        const extension = getExtensionFromKind(detected.kind);
        
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;

        // Generate proper filename with correct extension
        let downloadName: string;
        if (fileName === "unknown" || !fileName || fileName === "") {
            // Generate filename from detected type
            const base = "updated-" + detected.kind.replace(/\./g, '-');
            downloadName = base + extension;
        } else {
            // Use original filename but ensure correct extension
            const baseFileName = fileName.replace(/\.[^/.]+$/, "");
            downloadName = baseFileName + extension;
        }
        
        a.download = downloadName;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
            title: "Download started",
            description: `Updated ${detected.kind} file downloaded as ${downloadName}.`,
        });
    };

    const togglePreview = () => {
        setShowPreview(!showPreview);
    };

    return {
        // State
        updateMajor,
        updateMinor,
        updatePatch,
        showPreview,

        // Computed values
        updateStats,
        packagesToUpdate,
        updatedContent,

        // Actions
        setUpdateMajor,
        setUpdateMinor,
        setUpdatePatch,
        handleCopy,
        handleDownload,
        togglePreview,
    };
}