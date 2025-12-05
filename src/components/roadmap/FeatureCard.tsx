"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ThumbsUp,
  Clock,
  AlertTriangle,
  Target,
  Code,
  Tag,
} from "lucide-react";

interface Feature {
  id: number;
  title: string;
  description: string;
  status: string;
  upvotes: number;
  priority: string;
  impact: string;
  category: string;
  estimatedRelease: string;
  difficulty: string;
  tags: string[];
}

interface FeatureCardProps {
  feature: Feature;
  onUpvote: (id: number) => void;
}

const statusColors: { [key: string]: string } = {
  Completed: "bg-green-500",
  "In Progress": "bg-blue-500",
  Planned: "bg-orange-500",
  Research: "bg-purple-500",
};

const priorityColors: { [key: string]: string } = {
  Critical: "bg-red-500",
  High: "bg-orange-500",
  Medium: "bg-yellow-500",
  Low: "bg-gray-500",
};

const impactColors: { [key: string]: string } = {
  Major: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Minor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Patch: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

const difficultyColors: { [key: string]: string } = {
  Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Hard: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  "Very Hard": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const FeatureCard = ({ feature, onUpvote }: FeatureCardProps) => {
  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-200 relative z-30">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-semibold">
            {feature.title}
          </CardTitle>
          <Badge className={`${statusColors[feature.status]} text-white`}>
            {feature.status}
          </Badge>
        </div>

        {/* Priority and Impact badges */}
        <div className="flex gap-2 mb-3">
          <Badge
            variant="outline"
            className={`${priorityColors[feature.priority]} text-white text-xs`}
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            {feature.priority}
          </Badge>
          <Badge
            variant="outline"
            className={`${impactColors[feature.impact]} text-xs`}
          >
            <Target className="w-3 h-3 mr-1" />
            {feature.impact}
          </Badge>
        </div>

        <CardDescription className="text-sm text-muted-foreground">
          {feature.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow space-y-3">
        {/* Category and Release info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <Code className="w-3 h-3 mr-1" />
            <span>{feature.category}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>{feature.estimatedRelease}</span>
          </div>
        </div>

        {/* Difficulty */}
        <div className="flex items-center">
          <span className="text-xs text-muted-foreground mr-2">
            Difficulty:
          </span>
          <Badge
            variant="outline"
            className={`${difficultyColors[feature.difficulty]} text-xs`}
          >
            {feature.difficulty}
          </Badge>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {feature.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              <Tag className="w-2 h-2 mr-1" />
              {tag}
            </Badge>
          ))}
          {feature.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{feature.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          disabled
          onClick={() => onUpvote(feature.id)}
          variant="outline"
          className="w-full group relative z-40"
        >
          <ThumbsUp className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="text-muted-foreground group-hover:text-primary transition-colors">
            Upvote ({feature.upvotes})
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export { FeatureCard };
