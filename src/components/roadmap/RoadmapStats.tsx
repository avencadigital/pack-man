import React, { memo } from "react";
import { BarChart3, Users, Clock, Rocket } from "lucide-react";
import { RoadmapStats as RoadmapStatsType } from "@/types/roadmap";
import { ROADMAP_CONFIG } from "@/constants/roadmap";

interface RoadmapStatsProps {
  stats: RoadmapStatsType;
}

const RoadmapStats = memo(({ stats }: RoadmapStatsProps) => {
  const { iconColors, gridResponsive } = ROADMAP_CONFIG;

  return (
    <div
      className={`grid ${gridResponsive.stats} gap-4 p-4 bg-muted/50 rounded-xl`}
    >
      <div className="text-center">
        <div className="flex items-center justify-center mb-1">
          <BarChart3 className={`w-4 h-4 mr-1 ${iconColors.total}`} />
          <span className={`text-2xl font-bold ${iconColors.total}`}>
            {stats.total}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">Total Features</p>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center mb-1">
          <Users className={`w-4 h-4 mr-1 ${iconColors.votes}`} />
          <span className={`text-2xl font-bold ${iconColors.votes}`}>
            {stats.totalUpvotes}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">Total Votes</p>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center mb-1">
          <Clock className={`w-4 h-4 mr-1 ${iconColors.inProgress}`} />
          <span className={`text-2xl font-bold ${iconColors.inProgress}`}>
            {stats.inProgress}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">In Progress</p>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center mb-1">
          <Rocket className={`w-4 h-4 mr-1 ${iconColors.major}`} />
          <span className={`text-2xl font-bold ${iconColors.major}`}>
            {stats.majorFeatures}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">Major Impact</p>
      </div>
    </div>
  );
});

RoadmapStats.displayName = "RoadmapStats";

export { RoadmapStats };
