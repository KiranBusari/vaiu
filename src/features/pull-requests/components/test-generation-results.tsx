"use client";

import { useState } from "react";
import {
  ExternalLink,
  FileCode,
  FlaskConical,
  CheckCircle2,
  AlertCircle,
  Code2,
  Sparkles,
  Clock,
  Target,
  TrendingUp,
  Shield,
  Zap,
  Eye,
  Server,
  Layers,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { AITestGeneration, TestType, TestCase } from "../types-tests";

interface TestGenerationResultsProps {
  testGeneration: AITestGeneration;
  onClose?: () => void;
}

export function TestGenerationResults({
  testGeneration,
  onClose,
}: TestGenerationResultsProps) {
  const [activeTab, setActiveTab] = useState("summary");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getTestTypeIcon = (type: TestType) => {
    switch (type) {
      case TestType.UNIT:
        return <Code2 className="h-4 w-4" />;
      case TestType.INTEGRATION:
        return <Layers className="h-4 w-4" />;
      case TestType.E2E:
        return <TrendingUp className="h-4 w-4" />;
      case TestType.PERFORMANCE:
        return <Zap className="h-4 w-4" />;
      case TestType.SECURITY:
        return <Shield className="h-4 w-4" />;
      case TestType.ACCESSIBILITY:
        return <Eye className="h-4 w-4" />;
      case TestType.API:
        return <Server className="h-4 w-4" />;
      case TestType.COMPONENT:
        return <Layers className="h-4 w-4" />;
      default:
        return <FileCode className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive";
      case "high":
        return "default";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">AI Test Generation</h2>
            <Badge variant="outline" className="gap-1">
              <Sparkles className="h-3 w-3" />
              AI Powered
            </Badge>
          </div>
          <Link
            href={testGeneration.prUrl}
            target="_blank"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            PR #{testGeneration.prNumber}: {testGeneration.prTitle}
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
        {onClose && (
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Test Generation Summary</span>
            </div>
            <Badge variant="default" className="text-lg">
              {testGeneration.summary.totalTestsGenerated} Tests
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Object.entries(testGeneration.summary.testsByType).map(
              ([type, count]) =>
                count > 0 && (
                  <div
                    key={type}
                    className="flex flex-col items-center rounded-lg border border-border p-3 text-center"
                  >
                    <div className="mb-2 text-primary">
                      {getTestTypeIcon(type as TestType)}
                    </div>
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-xs capitalize text-muted-foreground">
                      {type}
                    </div>
                  </div>
                ),
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                Critical Tests
              </div>
              <div className="text-2xl font-bold">
                {testGeneration.summary.criticalTests}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileCode className="h-4 w-4" />
                Files with Tests
              </div>
              <div className="text-2xl font-bold">
                {testGeneration.summary.filesWithTests}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Estimated Time
              </div>
              <div className="text-2xl font-bold">
                {testGeneration.summary.estimatedTestingTime}
              </div>
            </div>
          </div>

          <Separator />

          {testGeneration.summary.coverageAreas && Array.isArray(testGeneration.summary.coverageAreas) && testGeneration.summary.coverageAreas.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Coverage Areas:</p>
              <div className="flex flex-wrap gap-2">
                {testGeneration.summary.coverageAreas.map((area, index) => (
                  <Badge key={index} variant="secondary">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {testGeneration.summary.recommendations && Array.isArray(testGeneration.summary.recommendations) && testGeneration.summary.recommendations.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Recommendations:</p>
              <ul className="space-y-1">
                {testGeneration.summary.recommendations.map((rec, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="summary">Test Scenarios</TabsTrigger>
          <TabsTrigger value="strategy">Testing Strategy</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          {testGeneration.scenarios.map((scenario) => (
            <Card key={scenario.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {scenario.feature}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {scenario.description}
                    </p>
                  </div>
                  <Badge variant={getRiskBadgeVariant(scenario.riskLevel)}>
                    {scenario.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
                {scenario.affectedFiles && Array.isArray(scenario.affectedFiles) && scenario.affectedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {scenario.affectedFiles.map((file, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <FileCode className="mr-1 h-3 w-3" />
                        {file}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[600px]">
                  <div className="space-y-3">
                    {scenario.testCases.map((testCase) => (
                      <TestCaseCard
                        key={testCase.id}
                        testCase={testCase}
                        getTestTypeIcon={getTestTypeIcon}
                        getPriorityColor={getPriorityColor}
                        copyToClipboard={copyToClipboard}
                        copiedId={copiedId}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Testing Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-2 font-semibold">Approach</h3>
                <p className="text-sm text-muted-foreground">
                  {testGeneration.testingStrategy.approach}
                </p>
              </div>

              {testGeneration.testingStrategy.focusAreas && Array.isArray(testGeneration.testingStrategy.focusAreas) && testGeneration.testingStrategy.focusAreas.length > 0 && (
                <div>
                  <h3 className="mb-2 font-semibold">Focus Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {testGeneration.testingStrategy.focusAreas.map(
                      (area, index) => (
                        <Badge key={index} variant="secondary">
                          {area}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              )}

              <div>
                <h3 className="mb-2 font-semibold">Recommended Framework</h3>
                <Badge variant="outline" className="text-sm">
                  {testGeneration.testingStrategy.testingFramework}
                </Badge>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">Run Instructions</h3>
                <div className="rounded-lg border border-border bg-muted p-4">
                  <code className="text-sm">
                    {testGeneration.testingStrategy.runInstructions}
                  </code>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 font-semibold">PR Context</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Files Changed: </span>
                    <span className="text-muted-foreground">
                      {testGeneration.context.filesChanged.length}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Commits: </span>
                    <span className="text-muted-foreground">
                      {testGeneration.context.commitMessages.length}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Author: </span>
                    <span className="text-muted-foreground">
                      {testGeneration.context.author}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div>
          Generated on {new Date(testGeneration.createdAt).toLocaleString()} •
          Version {testGeneration.generationVersion}
        </div>
        <Button variant="outline" asChild>
          <Link href={testGeneration.prUrl} target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            View PR on GitHub
          </Link>
        </Button>
      </div>
    </div>
  );
}

function TestCaseCard({
  testCase,
  getTestTypeIcon,
  getPriorityColor,
  copyToClipboard,
  copiedId,
}: {
  testCase: TestCase;
  getTestTypeIcon: (type: TestType) => JSX.Element;
  getPriorityColor: (
    priority: string,
  ) => "destructive" | "default" | "secondary" | "outline";
  copyToClipboard: (text: string, id: string) => void;
  copiedId: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-lg border border-border">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 hover:bg-muted/50">
            <div className="flex items-center gap-3">
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <div className="flex items-center gap-2">
                {getTestTypeIcon(testCase.type)}
                <span className="font-medium">{testCase.title}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getPriorityColor(testCase.priority)}>
                {testCase.priority}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {testCase.type}
              </Badge>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="space-y-4 border-t border-border p-4">
            <div>
              <h4 className="mb-1 text-sm font-semibold">Description</h4>
              <p className="text-sm text-muted-foreground">
                {testCase.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="mb-1 font-semibold">Target File</h4>
                <code className="text-xs text-muted-foreground">
                  {testCase.targetFile}
                </code>
              </div>
              <div>
                <h4 className="mb-1 font-semibold">Test File</h4>
                <code className="text-xs text-muted-foreground">
                  {testCase.suggestedTestFile}
                </code>
              </div>
            </div>

            <div>
              <h4 className="mb-1 text-sm font-semibold">Reasoning</h4>
              <p className="text-sm text-muted-foreground">
                {testCase.reasoning}
              </p>
            </div>

            {testCase.prerequisites && Array.isArray(testCase.prerequisites) && testCase.prerequisites.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold">Prerequisites</h4>
                <div className="flex flex-wrap gap-2">
                  {testCase.prerequisites.map((prereq, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {prereq}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {testCase.edgeCases && Array.isArray(testCase.edgeCases) && testCase.edgeCases.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold">
                  Edge Cases Covered
                </h4>
                <ul className="space-y-1">
                  {testCase.edgeCases.map((edgeCase, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0" />
                      {edgeCase}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-semibold">Test Code</h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    copyToClipboard(testCase.testCode, testCase.id)
                  }
                >
                  {copiedId === testCase.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <ScrollArea className="h-[400px] w-full">
                <pre className="max-w-full overflow-x-auto rounded-lg border border-border bg-muted p-4 pb-6 text-xs font-mono leading-relaxed">
                  <code className="block whitespace-pre-wrap break-words">
                    {testCase.testCode.replace(/\\n/g, '\n')}
                  </code>
                </pre>
              </ScrollArea>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
