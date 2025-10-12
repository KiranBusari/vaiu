"use client";

import { useState } from "react";
import { Brain, Clock, AlertTriangle, CheckCircle, Lightbulb, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

const getImpactColor = (level: string): "destructive" | "default" | "secondary" => {
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

const getUrgencyColor = (level: string): "destructive" | "default" | "secondary" => {
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
      }
    );
  };

  return (
    <Card className={`border-2 border-dashed border-gray-200 dark:border-gray-700 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <CardTitle className="text-lg font-semibold">
              AI Summary
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {type.toUpperCase()}
            </Badge>
          </div>
          {!summary && (
            <Button
              onClick={handleGenerateSummary}
              disabled={isPending}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {isPending ? "Analyzing..." : "Generate Summary"}
            </Button>
          )}
        </div>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
          Get AI-powered insights and recommendations for this {type}
        </CardDescription>
      </CardHeader>

      {summary && (
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Executive Summary
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {summary.executiveSummary}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium">Impact:</span>
              <Badge variant={getImpactColor(summary.impactLevel)}>
                {summary.impactLevel.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium">Urgency:</span>
              <Badge variant={getUrgencyColor(summary.urgency)}>
                {summary.urgency.toUpperCase()}
              </Badge>
            </div>
            {summary.estimatedEffort && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium">Effort:</span>
                <Badge variant="outline">{summary.estimatedEffort}</Badge>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                Key Points
              </h4>
            </div>
            <ul className="space-y-1">
              {summary.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                Recommendations
              </h4>
            </div>
            <ul className="space-y-1">
              {summary.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>

          {summary.affectedAreas && summary.affectedAreas.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                Affected Areas
              </h4>
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