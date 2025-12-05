"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Rocket } from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import { RoadmapStats } from "./RoadmapStats";
import { StatusLegend } from "./StatusLegend";
import { RoadmapSkeleton } from "./RoadmapSkeleton";
import { RoadmapError } from "./RoadmapError";
import { useRoadmapFeatures } from "@/hooks/useRoadmapFeatures";
import { ROADMAP_CONFIG } from "@/constants/roadmap";
import { ThemeImage } from "../ui/theme-image";

const MemoizedFeatureCard = memo(FeatureCard);

const Roadmap = memo(() => {
  const { features, handleUpvote, stats, isLoading, error } =
    useRoadmapFeatures();

  if (isLoading) return <RoadmapSkeleton />;
  if (error) return <RoadmapError error={error} />;

  const { requestFeatureUrl, gridResponsive } = ROADMAP_CONFIG;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 my-16 relative z-30 mt-60">
      <Card className="border-0 shadow-lg sm:shadow-xl relative z-30">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center justify-center gap-2">
            <Rocket className="w-6 h-6 sm:w-8 sm:h-8" />
            Roadmap
          </CardTitle>
          <p className="text-muted-foreground text-sm sm:text-base">
            Here's what we're working on next. Vote for your favorite features!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Statistics Section */}
          <RoadmapStats stats={stats} />

          {/* Status breakdown */}
          <StatusLegend stats={stats} />

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="roadmap-features">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">
                    Development Roadmap
                  </span>
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
            <Button
              asChild
              size="lg"
              variant="outline"
              className="relative z-40"
            >
              <a
                href={requestFeatureUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
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
    </div>
  );
});

Roadmap.displayName = "Roadmap";

export { Roadmap };
