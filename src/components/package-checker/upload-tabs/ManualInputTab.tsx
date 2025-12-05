"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText, CheckCircle2, Trash } from "lucide-react";

interface ManualInputTabProps {
    fileContent: string;
    detectedType: string | null;
    onContentChange: (content: string) => void;
}

export function ManualInputTab({
    fileContent,
    detectedType,
    onContentChange,
}: ManualInputTabProps) {
    const hasContent = fileContent.trim().length > 0;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Label
                        htmlFor="manual-input"
                        className="text-sm sm:text-base font-medium"
                    >
                        Paste file content
                    </Label>
                    {detectedType && (
                        <Badge
                            variant="secondary"
                            className="text-xs bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-300 dark:border-green-700"
                        >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {detectedType}
                        </Badge>
                    )}
                </div>
                {hasContent && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onContentChange("")}
                        className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                        <Trash className="w-3 h-3 mr-1" />
                        Clear
                    </Button>
                )}
            </div>
            <div className="relative">
                {hasContent ? (
                    <Accordion type="single" collapsible defaultValue="content">
                        <AccordionItem value="content" className="border-none">
                            <AccordionTrigger className="py-6 hover:no-underline">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    <span>Content Preview</span>
                                    <Badge
                                        variant="secondary"
                                        className="text-xs bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                                    >
                                        {fileContent.trim().split("\n").length} lines
                                    </Badge>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <Textarea
                                    id="manual-input"
                                    value={fileContent}
                                    onChange={(e) => onContentChange(e.target.value)}
                                    rows={10}
                                    className="font-mono text-xs sm:text-sm min-h-[160px] sm:min-h-[200px] resize-none border-green-300 bg-green-50/20 dark:border-green-700 dark:bg-green-950/10"
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ) : (
                    <Textarea
                        id="manual-input"
                        placeholder={`Paste your dependency file content here...

Examples:
• package.json: {"dependencies": {"react": "^18.0.0"}}
• requirements.txt: django==4.2.0
• pubspec.yaml: dependencies:\n  flutter:\n    sdk: flutter`}
                        value={fileContent}
                        onChange={(e) => onContentChange(e.target.value)}
                        rows={10}
                        className="font-mono text-xs sm:text-sm min-h-[160px] sm:min-h-[200px] resize-none"
                    />
                )}
            </div>
        </div>
    );
}
