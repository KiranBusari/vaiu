"use client";

import { useState } from "react";
import { ExternalLink, AlertTriangle, CheckCircle, XCircle, Clock, Star, TrendingUp, Shield, Zap, Code, GitPullRequest } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { AIReview } from "../types-ai";

interface AIReviewResultsProps {
  review: AIReview;
  onClose?: () => void;
}

export function AIReviewResults({ review, onClose }: AIReviewResultsProps) {
  const [activeTab, setActiveTab] = useState("summary");

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-600 bg-green-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "high": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "low": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "medium": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "high": 
      case "critical": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GitPullRequest className="h-5 w-5 text-blue-600" />
            <h2 className="text-2xl font-bold">AI Code Review</h2>
          </div>
          <Link 
            href={review.prUrl} 
            target="_blank" 
            className="text-sm text-muted-foreground hover:text-blue-600 flex items-center gap-1"
          >
            PR #{review.prNumber}: {review.prTitle}
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
        {onClose && (
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Overall Assessment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${getScoreColor(review.summary.overallScore)}`}>
                {review.summary.overallScore}/10
              </span>
              <Badge className={getRiskLevelColor(review.summary.riskLevel)}>
                {review.summary.riskLevel.toUpperCase()} RISK
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <Code className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <div className={`text-lg font-semibold ${getScoreColor(review.codeQuality.score)}`}>
                {review.codeQuality.score}/10
              </div>
              <div className="text-sm text-muted-foreground">Code Quality</div>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <div className={`text-lg font-semibold ${getScoreColor(review.security.score)}`}>
                {review.security.score}/10
              </div>
              <div className="text-sm text-muted-foreground">Security</div>
            </div>
            <div className="text-center">
              <Zap className="h-8 w-8 mx-auto text-purple-500 mb-2" />
              <div className={`text-lg font-semibold ${getScoreColor(review.performance.score)}`}>
                {review.performance.score}/10
              </div>
              <div className="text-sm text-muted-foreground">Performance</div>
            </div>
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-orange-500 mb-2" />
              <div className={`text-lg font-semibold ${getScoreColor(review.architecture.score)}`}>
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
                  <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
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
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="code">Code Quality</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge 
                variant={review.summary.recommendation === 'approve' ? 'default' : 'destructive'}
                className="mb-4"
              >
                {review.summary.recommendation.replace('_', ' ').toUpperCase()}
              </Badge>
              {review.projectContext.impactedFeatures.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium">Impacted Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {review.projectContext.impactedFeatures.map((feature, index) => (
                      <Badge key={index} variant="outline">{feature}</Badge>
                    ))}
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
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(issue.severity)}
                          <span className="font-medium">{issue.type}</span>
                          <Badge variant="outline" className="text-xs">
                            {issue.severity}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{issue.file}:{issue.line}</span>
                      </div>
                      <p className="text-sm">{issue.message}</p>
                      {issue.suggestion && (
                        <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                          💡 {issue.suggestion}
                        </p>
                      )}
                    </div>
                  ))}
                  
                  {review.codeQuality.suggestions.length > 0 && (
                    <div className="border rounded-lg p-4 bg-blue-50">
                      <p className="font-medium mb-2">General Suggestions:</p>
                      <ul className="space-y-1">
                        {review.codeQuality.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-blue-700">• {suggestion}</li>
                        ))}
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
                      <div key={index} className="border rounded-lg p-4 space-y-2 border-red-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getSeverityIcon(vuln.severity)}
                            <span className="font-medium">{vuln.type}</span>
                            <Badge variant="destructive" className="text-xs">
                              {vuln.severity}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">{vuln.file}:{vuln.line}</span>
                        </div>
                        <p className="text-sm">{vuln.description}</p>
                        <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          🔒 {vuln.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-green-600">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4" />
                    <p className="font-medium">No security vulnerabilities detected!</p>
                  </div>
                )}
                
                {review.security.recommendations.length > 0 && (
                  <div className="border rounded-lg p-4 bg-green-50 mt-4">
                    <p className="font-medium mb-2">Security Recommendations:</p>
                    <ul className="space-y-1">
                      {review.security.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-green-700">• {rec}</li>
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
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(issue.severity)}
                          <span className="font-medium">{issue.type}</span>
                          <Badge variant="outline" className="text-xs">
                            {issue.severity}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{issue.file}:{issue.line}</span>
                      </div>
                      <p className="text-sm">{issue.description}</p>
                      <p className="text-sm text-purple-600 bg-purple-50 p-2 rounded">
                        ⚡ {issue.optimization}
                      </p>
                    </div>
                  ))}
                  
                  {review.performance.optimizations.length > 0 && (
                    <div className="border rounded-lg p-4 bg-purple-50">
                      <p className="font-medium mb-2">Performance Optimizations:</p>
                      <ul className="space-y-1">
                        {review.performance.optimizations.map((opt, index) => (
                          <li key={index} className="text-sm text-purple-700">• {opt}</li>
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
                  <Badge variant="outline">{review.architecture.score}/10</Badge>
                  <Badge variant="outline">Consistency: {review.architecture.consistencyScore}/10</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {review.architecture.insights.map((insight, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        {insight.level === 'error' ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : insight.level === 'warning' ? (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
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
                      <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
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
      <div className="flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          Generated on {new Date(review.createdAt).toLocaleString()} • Analysis v{review.analysisVersion}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={review.prUrl} target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              View PR on GitHub
            </Link>
          </Button>
          <Button onClick={() => {
            // Future: Post review to GitHub
            toast.success("Feature coming soon: Post to GitHub");
          }}>
            Post to GitHub
          </Button>
        </div>
      </div>
    </div>
  );
}