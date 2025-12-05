"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, SearchCode, Settings } from "lucide-react";
import { PackageInfo, AnalysisSummary } from "@/types/package";
import { FileUploadSection } from "@/components/package-checker/FileUploadSection";
import { AnalysisStats } from "@/components/package-checker/AnalysisStats";
import { PackageResults } from "@/components/package-checker/PackageResults";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { usePackageAnalysis } from "@/hooks/use-package-analysis";
import { GitHubTokenDialog } from "@/components/github-token-dialog";
import { createFileFromContent } from "@/utils/file-utils";
import { detectFileType } from "@/lib/parsers";

export default function WebPage() {
    const [fileContent, setFileContent] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [results, setResults] = useState<PackageInfo[]>([]);
    const [summary, setSummary] = useState<AnalysisSummary | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleFileContentChange = (content: string | any) => {
        const stringContent = typeof content === "string" ? content : String(content || "");
        setFileContent(stringContent);
        if (results.length > 0 || summary) {
            setResults([]);
            setSummary(null);
            setError(null);
        }
    };

    const handleFileSelect = (file: File | null) => {
        setSelectedFile(file);
        if (results.length > 0 || summary) {
            setResults([]);
            setSummary(null);
            setError(null);
        }
    };

    const { isAnalyzing, analysisProgress, analyzePackages } = usePackageAnalysis({
        onAnalysisComplete: (newResults, newSummary) => {
            setResults(newResults);
            setSummary(newSummary);
            setError(null);
        },
        onError: (errorMessage) => {
            setError(errorMessage);
            setResults([]);
            setSummary(null);
        },
    });

    const handleAnalyze = () => {
        const content = typeof fileContent === "string" ? fileContent : String(fileContent || "");
        let fileName = selectedFile?.name || "unknown";

        if (!selectedFile && content.trim()) {
            try {
                const detected = detectFileType(content);
                fileName = detected.kind;
            } catch (err) {
                console.log("[WebPage] Could not detect file type from paste:", err);
            }
        }

        analyzePackages(content, fileName);
    };

    return (
        <div className="min-h-screen w-full relative">
            <Header />

            {/* Diagonal Fade Grid Background - Top Left */}
            <div
                className="absolute inset-0 z-0 opacity-50 dark:opacity-20"
                style={{
                    backgroundImage: `
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
          `,
                    backgroundSize: "32px 32px",
                    WebkitMaskImage:
                        "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
                    maskImage:
                        "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
                }}
            />

            {/* Content */}
            <div className="relative z-10 pt-16 px-4">
                <div className="max-w-6xl mx-auto py-8 space-y-6 sm:space-y-8">
                    <Card className="border-0 shadow-lg sm:shadow-xl" data-analyze-section>
                        <CardHeader className="space-y-2 pb-4 sm:pb-6">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                    <SearchCode className="w-5 h-5 sm:w-6 sm:h-6" />
                                    <span>Analyze Dependencies</span>
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsSettingsOpen(true)}
                                    aria-label="Settings"
                                >
                                    <Settings className="w-5 h-5" />
                                </Button>
                            </div>
                            <CardDescription className="text-sm sm:text-base">
                                Upload dependency files or paste content manually
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FileUploadSection
                                fileContent={fileContent}
                                selectedFile={selectedFile}
                                onFileContentChange={handleFileContentChange}
                                onFileSelect={handleFileSelect}
                                onAnalyze={handleAnalyze}
                                onDirectAnalyze={(content: string, fileName: string) => {
                                    if (!content || content.trim().length === 0) {
                                        setError("File content is empty");
                                        return;
                                    }
                                    setFileContent(content);
                                    const virtualFile = createFileFromContent(content, fileName);
                                    setSelectedFile(virtualFile);
                                    analyzePackages(content, fileName);
                                }}
                                isAnalyzing={isAnalyzing}
                                analysisProgress={analysisProgress}
                                error={error}
                            />
                        </CardContent>
                    </Card>

                    {results.length > 0 && summary && (
                        <Card className="border-0 shadow-lg sm:shadow-xl">
                            <CardHeader className="space-y-2 pb-4 sm:pb-6">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                        <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                                        <span>Analysis Results</span>
                                    </CardTitle>
                                </div>
                                <AnalysisStats summary={summary} />
                            </CardHeader>
                            <CardContent>
                                <PackageResults
                                    results={results}
                                    originalContent={fileContent}
                                    fileName={(() => {
                                        if (selectedFile) return selectedFile.name;
                                        try {
                                            const detected = detectFileType(fileContent);
                                            return detected.kind;
                                        } catch {
                                            return "unknown";
                                        }
                                    })()}
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <Footer />

            <GitHubTokenDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
        </div>
    );
}
