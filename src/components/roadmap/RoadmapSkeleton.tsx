import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const RoadmapSkeleton = () => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 my-16 relative z-30 mt-60">
      <Card className="border-0 shadow-lg sm:shadow-xl relative z-30">
        <CardHeader className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Statistics Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-8 w-12 mx-auto mb-1" />
                <Skeleton className="h-3 w-20 mx-auto" />
              </div>
            ))}
          </div>

          {/* Status Legend Skeleton */}
          <div className="flex flex-wrap gap-2 justify-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-1">
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>

          {/* Accordion Skeleton */}
          <div className="w-full">
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* Button Skeleton */}
          <div className="text-center mt-8">
            <Skeleton className="h-10 w-40 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { RoadmapSkeleton };
