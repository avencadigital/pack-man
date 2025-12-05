"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { memo } from "react";
import { FeatureCard } from "@/components/roadmap/FeatureCard";
import { RoadmapStats } from "@/components/roadmap/RoadmapStats";
import { StatusLegend } from "@/components/roadmap/StatusLegend";
import { RoadmapSkeleton } from "@/components/roadmap/RoadmapSkeleton";
import { RoadmapError } from "@/components/roadmap/RoadmapError";
import { useRoadmapFeatures } from "@/hooks/useRoadmapFeatures";
import { ROADMAP_CONFIG } from "@/constants/roadmap";
import { ThemeImage } from "@/components/ui/theme-image";

const MemoizedFeatureCard = memo(FeatureCard);

export default function FeaturesPage() {
    const { features, handleUpvote, stats, isLoading, error } = useRoadmapFeatures();
    const { requestFeatureUrl, gridResponsive } = ROADMAP_CONFIG;

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
                <div className="max-w-6xl mx-auto py-8">
                    {isLoading ? (
                        <RoadmapSkeleton />
                    ) : error ? (
                        <RoadmapError error={error} />
                    ) : (
                        <Card className="border-0 shadow-lg sm:shadow-xl">
                            <CardHeader className="space-y-2 pb-4 sm:pb-6">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                        <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />
                                        <span>Roadmap</span>
                                    </CardTitle>
                                </div>
                                <CardDescription className="text-sm sm:text-base">
                                    Here's what we're working on next. Vote for your favorite features!
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <RoadmapStats stats={stats} />
                                <StatusLegend stats={stats} />

                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="roadmap-features">
                                        <AccordionTrigger className="hover:no-underline">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-semibold">Development Roadmap</span>
                                                <span className="text-sm text-muted-foreground">
                                                    ({features.length} features)
                                                </span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className={`${gridResponsive.features} mt-4`}>
                                                {features.map((feature) => (
                                                    <MemoizedFeatureCard
                                                        key={feature.id}
                                                        feature={feature}
                                                        onUpvote={() => handleUpvote(feature.id)}
                                                    />
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>

                                <div className="text-center mt-8">
                                    <Button asChild size="lg" variant="outline">
                                        <a href={requestFeatureUrl} target="_blank" rel="noopener noreferrer">
                                            <div className="relative w-5 h-5 mr-2">
                                                <ThemeImage
                                                    srcLight="/logos/pacmonster.svg"
                                                    srcDark="/logos/pacman_white.svg"
                                                    alt="Pack-Man Logo"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                            Suggest a Feature
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
