"use client";

import { useState } from "react";
import {
  Brain,
  Clock,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Target,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useGenerateAISummary } from "../api/use-generate-ai-summary";
import { SummaryOutput } from "@/lib/ai-service";

interface AISummaryCardProps {
  workspaceId: string;
  projectId: string;
  type: "pr" | "issue";
  identifier: string | number;
  title: string;
  className?: string;
}

const getImpactColor = (
  level: string,
): "destructive" | "default" | "secondary" => {
  switch (level) {
    case "high":
      return "destructive";
    case "medium":
      return "default";
    case "low":
      return "secondary";
    default:
      return "default";
  }
};

const getUrgencyColor = (
  level: string,
): "destructive" | "default" | "secondary" => {
  switch (level) {
    case "high":
      return "destructive";
    case "medium":
      return "default";
    case "low":
      return "secondary";
    default:
      return "default";
  }
};

export const AISummaryCard = ({
  workspaceId,
  projectId,
  type,
  identifier,
  className,
}: AISummaryCardProps) => {
  const [summary, setSummary] = useState<SummaryOutput | null>(null);

  const { mutate: generateSummary, isPending } = useGenerateAISummary();

  const handleGenerateSummary = () => {
    generateSummary(
      {
        json: {
          workspaceId,
          projectId,
          type,
          identifier,
        },
      },
      {
        onSuccess: (response) => {
          if ("data" in response) {
            setSummary(response.data);
            toast.success("AI summary generated successfully!");
          }
        },
        onError: () => {
          toast.error("Failed to generate AI summary");
        },
      },
    );
  };

  return (
    <Card className={`border-2 border-dashed border-border ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">AI Summary</CardTitle>
            <Badge variant="outline" className="text-xs">
              {type.toUpperCase()}
            </Badge>
          </div>
          {!summary && (
            <Button
              onClick={handleGenerateSummary}
              disabled={isPending}
              size="sm"
              variant="default"
            >
              {isPending ? "Analyzing..." : "Generate Summary"}
            </Button>
          )}
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Get AI-powered insights and recommendations for this {type}
        </CardDescription>
      </CardHeader>

      {summary && (
        <CardContent className="min-h-[70vh] w-full space-y-4">
          <div className="rounded-lg border bg-muted p-4">
            <h4 className="mb-2 font-semibold text-foreground">
              Executive Summary
            </h4>
            <p className="text-sm text-muted-foreground">
              {summary.executiveSummary}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Impact:</span>
              <Badge variant={getImpactColor(summary.impactLevel)}>
                {summary.impactLevel.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Urgency:</span>
              <Badge variant={getUrgencyColor(summary.urgency)}>
                {summary.urgency.toUpperCase()}
              </Badge>
            </div>
            {summary.estimatedEffort && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Effort:</span>
                <Badge variant="outline">{summary.estimatedEffort}</Badge>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-foreground">Key Points</h4>
            </div>
            <ul className="space-y-1">
              {summary.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-foreground">Recommendations</h4>
            </div>
            <ul className="space-y-1">
              {summary.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <span className="text-muted-foreground">
                    {recommendation}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {summary.affectedAreas && summary.affectedAreas.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Affected Areas</h4>
              <div className="flex flex-wrap gap-2">
                {summary.affectedAreas.map((area, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button
              onClick={handleGenerateSummary}
              disabled={isPending}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {isPending ? "Regenerating..." : "Regenerate Summary"}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
