"use client";

import { useState } from "react";
import {
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  TrendingUp,
  Shield,
  Zap,
  Code,
  GitPullRequest,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { AIReview } from "../types-ai";

interface AIReviewResultsProps {
  review: AIReview;
  onClose?: () => void;
}

export function AIReviewResults({ review }: AIReviewResultsProps) {
  const [activeTab, setActiveTab] = useState("summary");

  const getRiskVariant = (
    level: string,
  ): "secondary" | "default" | "destructive" => {
    switch (level) {
      case "low":
        return "secondary";
      case "medium":
        return "default";
      case "high":
        return "destructive";
      default:
        return "default";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-foreground";
    if (score >= 6) return "text-muted-foreground";
    return "text-destructive";
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "low":
        return <CheckCircle className="h-4 w-4 text-foreground" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-foreground" />;
      case "high":
      case "critical":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <GitPullRequest className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">AI Code Review</h2>
        </div>
        <Link
          href={review.prUrl}
          target="_blank"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          PR #{review.prNumber}: {review.prTitle}
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <span>Overall Assessment</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-bold ${getScoreColor(review.summary.overallScore)}`}
              >
                {review.summary.overallScore}/10
              </span>
              <Badge variant={getRiskVariant(review.summary.riskLevel)}>
                {review.summary.riskLevel.toUpperCase()} RISK
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <Code className="mx-auto mb-2 h-8 w-8 text-primary" />
              <div
                className={`text-lg font-semibold ${getScoreColor(review.codeQuality.score)}`}
              >
                {review.codeQuality.score}/10
              </div>
              <div className="text-sm text-muted-foreground">Code Quality</div>
            </div>
            <div className="text-center">
              <Shield className="mx-auto mb-2 h-8 w-8 text-primary" />
              <div
                className={`text-lg font-semibold ${getScoreColor(review.security.score)}`}
              >
                {review.security.score}/10
              </div>
              <div className="text-sm text-muted-foreground">Security</div>
            </div>
            <div className="text-center">
              <Zap className="mx-auto mb-2 h-8 w-8 text-primary" />
              <div
                className={`text-lg font-semibold ${getScoreColor(review.performance.score)}`}
              >
                {review.performance.score}/10
              </div>
              <div className="text-sm text-muted-foreground">Performance</div>
            </div>
            <div className="text-center">
              <TrendingUp className="mx-auto mb-2 h-8 w-8 text-primary" />
              <div
                className={`text-lg font-semibold ${getScoreColor(review.architecture.score)}`}
              >
                {review.architecture.score}/10
              </div>
              <div className="text-sm text-muted-foreground">Architecture</div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Estimated review time: {review.summary.estimatedReviewTime}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Key Findings:</p>
              <ul className="space-y-1">
                {review.summary.keyFindings.map((finding, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle className="h-3 w-3 flex-shrink-0 text-primary" />
                    {finding}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger
            value="summary"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Summary
          </TabsTrigger>
          <TabsTrigger
            value="code"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Code Quality
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Security
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Performance
          </TabsTrigger>
          <TabsTrigger
            value="architecture"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Architecture
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant={
                  review.summary.recommendation === "approve"
                    ? "default"
                    : "destructive"
                }
                className="mb-4"
              >
                {review.summary.recommendation.replace("_", " ").toUpperCase()}
              </Badge>
              {review.projectContext.impactedFeatures.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium">Impacted Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {review.projectContext.impactedFeatures.map(
                      (feature, index) => (
                        <Badge key={index} variant="outline">
                          {feature}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Code Quality Analysis
                <Badge variant="outline">{review.codeQuality.score}/10</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {review.codeQuality.issues.map((issue, index) => (
                    <div
                      key={index}
                      className="space-y-2 rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(issue.severity)}
                          <span className="font-medium">{issue.type}</span>
                          <Badge variant="outline" className="text-xs">
                            {issue.severity}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {issue.file}:{issue.line}
                        </span>
                      </div>
                      <p className="text-sm">{issue.message}</p>
                      {issue.suggestion && (
                        <p className="rounded border border-border bg-muted p-2 text-sm">
                          💡 {issue.suggestion}
                        </p>
                      )}
                    </div>
                  ))}

                  {review.codeQuality.suggestions.length > 0 && (
                    <div className="rounded-lg border border-border bg-muted p-4">
                      <p className="mb-2 font-medium">General Suggestions:</p>
                      <ul className="space-y-1">
                        {review.codeQuality.suggestions.map(
                          (suggestion, index) => (
                            <li
                              key={index}
                              className="text-sm text-muted-foreground"
                            >
                              • {suggestion}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Security Analysis
                <Badge variant="outline">{review.security.score}/10</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {review.security.vulnerabilities.length > 0 ? (
                  <div className="space-y-4">
                    {review.security.vulnerabilities.map((vuln, index) => (
                      <div
                        key={index}
                        className="space-y-2 rounded-lg border border-border p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getSeverityIcon(vuln.severity)}
                            <span className="font-medium">{vuln.type}</span>
                            <Badge variant="destructive" className="text-xs">
                              {vuln.severity}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {vuln.file}:{vuln.line}
                          </span>
                        </div>
                        <p className="text-sm">{vuln.description}</p>
                        <p className="rounded border border-border bg-muted p-2 text-sm">
                          🔒 {vuln.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-foreground">
                    <CheckCircle className="mx-auto mb-4 h-12 w-12" />
                    <p className="font-medium">
                      No security vulnerabilities detected!
                    </p>
                  </div>
                )}

                {review.security.recommendations.length > 0 && (
                  <div className="mt-4 rounded-lg border border-border bg-muted p-4">
                    <p className="mb-2 font-medium">
                      Security Recommendations:
                    </p>
                    <ul className="space-y-1">
                      {review.security.recommendations.map((rec, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground"
                        >
                          • {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Performance Analysis
                <Badge variant="outline">{review.performance.score}/10</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {review.performance.issues.map((issue, index) => (
                    <div
                      key={index}
                      className="space-y-2 rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(issue.severity)}
                          <span className="font-medium">{issue.type}</span>
                          <Badge variant="outline" className="text-xs">
                            {issue.severity}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {issue.file}:{issue.line}
                        </span>
                      </div>
                      <p className="text-sm">{issue.description}</p>
                      <p className="rounded border border-border bg-muted p-2 text-sm">
                        ⚡ {issue.optimization}
                      </p>
                    </div>
                  ))}

                  {review.performance.optimizations.length > 0 && (
                    <div className="rounded-lg border border-border bg-muted p-4">
                      <p className="mb-2 font-medium">
                        Performance Optimizations:
                      </p>
                      <ul className="space-y-1">
                        {review.performance.optimizations.map((opt, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground"
                          >
                            • {opt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Architecture Analysis
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {review.architecture.score}/10
                  </Badge>
                  <Badge variant="outline">
                    Consistency: {review.architecture.consistencyScore}/10
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {review.architecture.insights.map((insight, index) => (
                    <div
                      key={index}
                      className="space-y-2 rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center gap-2">
                        {insight.level === "error" ? (
                          <XCircle className="h-4 w-4 text-destructive" />
                        ) : insight.level === "warning" ? (
                          <AlertTriangle className="h-4 w-4 text-foreground" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-foreground" />
                        )}
                        <span className="font-medium">{insight.type}</span>
                        <Badge variant="outline" className="text-xs">
                          {insight.level}
                        </Badge>
                      </div>
                      <p className="text-sm">{insight.description}</p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Impact:</strong> {insight.impact}
                      </p>
                      <p className="rounded border border-border bg-muted p-2 text-sm">
                        🏗️ {insight.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Generated on {new Date(review.createdAt).toLocaleString()} • Analysis
          v{review.analysisVersion}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={review.prUrl} target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              View PR on GitHub
            </Link>
          </Button>
          <Button
            onClick={() => {
              // Future: Post review to GitHub
              toast.success("Feature coming soon: Post to GitHub");
            }}
          >
            Post to GitHub
          </Button>
        </div>
      </div>
    </div>
  );
}
