"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle2, Trash } from "lucide-react";
import { formatFileSize } from "@/lib/formatters";

interface FileUploadTabProps {
    selectedFile: File | null;
    dragActive: boolean;
    onDragEnter: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClearFile: () => void;
}

export function FileUploadTab({
    selectedFile,
    dragActive,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onFileChange,
    onClearFile,
}: FileUploadTabProps) {
    return (
        <div className="space-y-3">
            <Label
                htmlFor="file-upload"
                className="text-sm sm:text-base font-medium"
            >
                Select dependency file
            </Label>
            <div
                className={`relative flex flex-col items-center justify-center w-full min-h-[120px] px-6 py-8 text-sm border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${dragActive
                        ? "border-primary bg-primary/5 scale-[1.02]"
                        : selectedFile
                            ? "border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-950/20"
                            : "border-muted-foreground/25 bg-muted/20 hover:border-muted-foreground/40 hover:bg-muted/30"
                    }`}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
            >
                <Label
                    htmlFor="file-upload"
                    className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-3"
                >
                    {selectedFile ? (
                        <>
                            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                            <div className="text-center">
                                <p className="font-medium text-green-700 dark:text-green-300">
                                    {selectedFile.name}
                                </p>
                                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                    {formatFileSize(selectedFile.size)} • Ready to analyze
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <Upload
                                className={`w-8 h-8 ${dragActive ? "text-primary" : "text-muted-foreground"
                                    }`}
                            />
                            <div className="text-center">
                                <p
                                    className={`font-medium ${dragActive ? "text-primary" : "text-foreground"
                                        }`}
                                >
                                    {dragActive
                                        ? "Drop your file here"
                                        : "Click to select or drag & drop"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Supports: package.json, requirements.txt, pubspec.yaml
                                </p>
                            </div>
                        </>
                    )}
                </Label>
                <Input
                    id="file-upload"
                    type="file"
                    accept=".json,.txt,.yaml,.yml"
                    onChange={onFileChange}
                    className="sr-only"
                />
                {selectedFile && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-950"
                        onClick={onClearFile}
                    >
                        <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                )}
            </div>
        </div>
    );
}
