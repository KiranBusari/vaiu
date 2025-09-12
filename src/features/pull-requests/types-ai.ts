import { PullRequest } from "./types";

export interface AIReviewRequest {
  projectId: string;
  prNumber: number;
  workspaceId: string;
}

export interface CodeQualityIssue {
  type: 'complexity' | 'maintainability' | 'style' | 'performance';
  severity: 'low' | 'medium' | 'high';
  file: string;
  line?: number;
  message: string;
  suggestion?: string;
}

export interface SecurityVulnerability {
  type: 'authentication' | 'authorization' | 'input_validation' | 'data_exposure' | 'crypto';
  severity: 'low' | 'medium' | 'high' | 'critical';
  file: string;
  line?: number;
  description: string;
  recommendation: string;
}

export interface PerformanceIssue {
  type: 'database' | 'memory' | 'cpu' | 'network' | 'algorithm';
  severity: 'low' | 'medium' | 'high';
  file: string;
  line?: number;
  description: string;
  optimization: string;
}

export interface ArchitecturalInsight {
  type: 'pattern' | 'dependency' | 'consistency' | 'design';
  level: 'suggestion' | 'warning' | 'error';
  description: string;
  impact: string;
  recommendation: string;
}

export interface ProjectContext {
  relatedIssues: Array<{
    number: number;
    title: string;
    url: string;
    relevance: string;
  }>;
  impactedFeatures: string[];
  teamNotifications: string[];
  conventionViolations: string[];
}

export interface AIReviewSummary {
  overallScore: number; // 1-10
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: 'approve' | 'request_changes' | 'needs_discussion';
  keyFindings: string[];
  estimatedReviewTime: string;
}

export interface AIReview {
  id: string;
  prNumber: number;
  prTitle: string;
  prUrl: string;
  projectId: string;
  summary: AIReviewSummary;
  codeQuality: {
    score: number;
    issues: CodeQualityIssue[];
    suggestions: string[];
  };
  security: {
    score: number;
    vulnerabilities: SecurityVulnerability[];
    recommendations: string[];
  };
  performance: {
    score: number;
    issues: PerformanceIssue[];
    optimizations: string[];
  };
  architecture: {
    score: number;
    insights: ArchitecturalInsight[];
    consistencyScore: number;
  };
  projectContext: ProjectContext;
  createdAt: string;
  analysisVersion: string;
}

export interface AIReviewStatus {
  status: 'pending' | 'analyzing' | 'completed' | 'error';
  progress?: number;
  message?: string;
  error?: string;
}