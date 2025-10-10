import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "@/config";

// Initialize Gemini AI
const client = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});
const MODEL_NAME = "gemini-1.5-flash";

export interface PRAnalysisInput {
  prTitle: string;
  prDescription: string;
  files: Array<{
    filename: string;
    additions: number;
    deletions: number;
    changes: number;
    patch?: string;
    status: string;
  }>;
  prUrl: string;
  repoName: string;
  baseBranch: string;
  headBranch: string;
  existingReviews: Array<{
    user: string;
    state: string;
    body: string;
    submittedAt: string;
  }>;
  repoInfo: {
    language: string | null;
    description: string | null;
    topics: string[];
    size: number;
    defaultBranch: string;
  };
}

// AI Summary Types
export interface SummaryInput {
  title: string;
  description: string;
  type: 'pr' | 'issue';
  context: {
    repoName: string;
    assignee?: string;
    labels?: string[];
    comments?: Array<{
      user: string;
      body: string;
      createdAt: string;
    }>;
  };
}

export interface SummaryOutput {
  executiveSummary: string;
  keyPoints: string[];
  impactLevel: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high';
  recommendations: string[];
  estimatedEffort?: string;
  affectedAreas: string[];
}

export async function generateAISummary(input: SummaryInput): Promise<SummaryOutput> {
  const prompt = createSummaryPrompt(input);
  
  try {
    const result = await client.models.generateContent({
      model: MODEL_NAME,
      contents: prompt
    });

    const text = result.text;
    
    if (!text) {
      throw new Error('No response text from Gemini API');
    }
    
    // Clean the response text to extract JSON from markdown code blocks
    let cleanedText = text.trim();
    
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    const summary = JSON.parse(cleanedText);
    return summary;
  } catch (error) {
    console.error("AI summary failed:", error);
    return createFallbackSummary(input);
  }
}

function createSummaryPrompt(input: SummaryInput): string {
  const contextInfo = input.context;
  
  return `
You are an expert technical project manager specializing in summarizing GitHub ${input.type === 'pr' ? 'Pull Requests' : 'Issues'} for development teams.

## Context:
- **Repository**: ${contextInfo.repoName}
- **Type**: ${input.type.toUpperCase()}
- **Title**: ${input.title}
- **Description**: ${input.description}
- **Assignee**: ${contextInfo.assignee || 'Unassigned'}
- **Labels**: ${contextInfo.labels?.join(', ') || 'None'}

${contextInfo.comments && contextInfo.comments.length > 0 ? `
## Recent Comments:
${contextInfo.comments.map(comment => 
  `**${comment.user}** (${comment.createdAt}): ${comment.body.substring(0, 200)}${comment.body.length > 200 ? '...' : ''}`
).join('\n')}
` : ''}

Please analyze this ${input.type} and provide a comprehensive summary that helps team members quickly understand:
1. What this ${input.type} is about
2. The impact and urgency level
3. Key action items and recommendations
4. Estimated effort (if applicable)
5. Areas of the codebase/project that might be affected

Return a JSON response with this exact structure:

{
  "executiveSummary": "<2-3 sentence high-level summary>",
  "keyPoints": ["<key point 1>", "<key point 2>", "<key point 3>"],
  "impactLevel": "<low|medium|high>",
  "urgency": "<low|medium|high>",
  "recommendations": ["<recommendation 1>", "<recommendation 2>"],
  "estimatedEffort": "<effort estimate or null>",
  "affectedAreas": ["<area 1>", "<area 2>"]
}

## Guidelines:
1. **Executive Summary**: Concise overview that executives/managers can understand
2. **Key Points**: Most important technical or business aspects
3. **Impact Level**: How much this affects the project (consider scope, complexity, dependencies)
4. **Urgency**: How quickly this needs attention (consider deadlines, blocking issues, security)
5. **Recommendations**: Actionable next steps for the team
6. **Estimated Effort**: For PRs, review time; for Issues, implementation time
7. **Affected Areas**: Parts of the system/codebase that might be impacted

**IMPORTANT**: Return ONLY the raw JSON object, no markdown formatting, no code blocks. Start directly with { and end with }.
`;
}

function createFallbackSummary(input: SummaryInput): SummaryOutput {
  return {
    executiveSummary: `${input.type === 'pr' ? 'Pull Request' : 'Issue'} requires manual review as AI analysis is unavailable.`,
    keyPoints: [
      `${input.type === 'pr' ? 'Code changes' : 'Issue'} need manual review`,
      "AI summary generation failed",
      "Please review manually for details"
    ],
    impactLevel: "medium",
    urgency: "medium",
    recommendations: [
      "Conduct manual review",
      "Check with team lead if needed"
    ],
    estimatedEffort: input.type === 'pr' ? "Manual review needed" : "Assessment required",
    affectedAreas: ["Unknown - manual review needed"]
  };
}

export async function analyzeWithGemini(input: PRAnalysisInput) {
  const prompt = createAnalysisPrompt(input);
  
  try {
    const result = await client.models.generateContent({
      model: MODEL_NAME,
      contents: prompt
    });

    const text = result.text;
    
    if (!text) {
      throw new Error('No response text from Gemini API');
    }
    
    // Clean the response text to extract JSON from markdown code blocks
    let cleanedText = text.trim();
    
    // Remove markdown code blocks if present
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Parse the JSON response from Gemini
    const analysis = JSON.parse(cleanedText);
    return analysis;
  } catch (error) {
    console.error("Gemini AI analysis failed:", error);
    // Fallback to mock data if AI fails
    return createFallbackAnalysis(input);
  }
}

function createAnalysisPrompt(input: PRAnalysisInput): string {
  const filesInfo = input.files.map(file => ({
    name: file.filename,
    additions: file.additions,
    deletions: file.deletions,
    changes: file.changes,
    patch: file.patch?.substring(0, 2000), // Limit patch size
    status: file.status
  }));

  return `
You are a senior code reviewer with expertise in software engineering best practices, security, performance, and architecture. Analyze this GitHub Pull Request and provide a comprehensive review.

## Repository Context:
- **Repository**: ${input.repoName}
- **Primary Language**: ${input.repoInfo.language || 'Mixed'}
- **Description**: ${input.repoInfo.description || 'No description'}
- **Topics**: ${input.repoInfo.topics.length > 0 ? input.repoInfo.topics.join(', ') : 'None'}
- **Repository Size**: ${Math.round(input.repoInfo.size / 1024)}MB
- **Default Branch**: ${input.repoInfo.defaultBranch}

## Pull Request Details:
- **Title**: ${input.prTitle}
- **Description**: ${input.prDescription}
- **Base Branch**: ${input.baseBranch}
- **Head Branch**: ${input.headBranch}
- **Files Changed**: ${input.files.length}

## Files and Changes:
${JSON.stringify(filesInfo, null, 2)}

## Existing Reviews:
${input.existingReviews.length > 0 ? 
  input.existingReviews.map(review => 
    `### ${review.user} (${review.state}) - ${review.submittedAt}\n${review.body || 'No comment'}`
  ).join('\n\n') 
  : 'No existing reviews'}

Please analyze this PR and return a JSON response with the following exact structure:

{
  "summary": {
    "overallScore": <number 1-10>,
    "riskLevel": "<low|medium|high>",
    "recommendation": "<approve|request_changes|needs_discussion>",
    "keyFindings": ["<finding1>", "<finding2>", "<finding3>"],
    "estimatedReviewTime": "<time estimate>"
  },
  "codeQuality": {
    "score": <number 1-10>,
    "issues": [
      {
        "type": "<complexity|maintainability|style|performance>",
        "severity": "<low|medium|high>",
        "file": "<filename>",
        "line": <line_number>,
        "message": "<issue description>",
        "suggestion": "<improvement suggestion>"
      }
    ],
    "suggestions": ["<general suggestion 1>", "<general suggestion 2>"]
  },
  "security": {
    "score": <number 1-10>,
    "vulnerabilities": [
      {
        "type": "<authentication|authorization|input_validation|data_exposure|crypto>",
        "severity": "<low|medium|high|critical>",
        "file": "<filename>",
        "line": <line_number>,
        "description": "<vulnerability description>",
        "recommendation": "<how to fix>"
      }
    ],
    "recommendations": ["<security recommendation 1>", "<security recommendation 2>"]
  },
  "performance": {
    "score": <number 1-10>,
    "issues": [
      {
        "type": "<database|memory|cpu|network|algorithm>",
        "severity": "<low|medium|high>",
        "file": "<filename>",
        "line": <line_number>,
        "description": "<performance issue>",
        "optimization": "<optimization suggestion>"
      }
    ],
    "optimizations": ["<optimization 1>", "<optimization 2>"]
  },
  "architecture": {
    "score": <number 1-10>,
    "insights": [
      {
        "type": "<pattern|dependency|consistency|design>",
        "level": "<suggestion|warning|error>",
        "description": "<architectural insight>",
        "impact": "<impact description>",
        "recommendation": "<architectural recommendation>"
      }
    ],
    "consistencyScore": <number 1-10>
  },
  "projectContext": {
    "relatedIssues": [],
    "impactedFeatures": ["<feature1>", "<feature2>"],
    "teamNotifications": ["<notification1>"],
    "conventionViolations": ["<violation1>"]
  }
}

## Analysis Guidelines:
1. **Code Quality**: Look for complexity, maintainability, coding standards, naming conventions appropriate for the repository's primary language
2. **Security**: Check for vulnerabilities, authentication issues, input validation, data exposure relevant to the technology stack
3. **Performance**: Identify potential bottlenecks, inefficient algorithms, resource usage considering the repository size and purpose
4. **Architecture**: Evaluate design patterns, code organization, dependency management that align with repository topics and description
5. **Best Practices**: Consider testing, documentation, error handling standards for the project's domain
6. **Existing Reviews**: Build upon previous feedback, avoid repeating already identified issues, acknowledge resolved concerns
7. **Repository Context**: Consider the project's purpose, scale, and technology choices when making recommendations

## Scoring Guidelines:
- **9-10**: Excellent, production-ready code with best practices
- **7-8**: Good code with minor improvements needed  
- **5-6**: Acceptable but needs attention in several areas
- **3-4**: Poor quality, significant issues that need addressing
- **1-2**: Major problems, should not be merged

Be thorough but practical. Focus on actionable feedback that will help improve the code quality and maintainability.

**IMPORTANT**: Return ONLY the raw JSON object, no markdown formatting, no code blocks, no additional text. Start directly with { and end with }.
`;
}

function createFallbackAnalysis(input: PRAnalysisInput) {
  // Fallback analysis when AI fails
  return {
    summary: {
      overallScore: 7,
      riskLevel: "low" as const,
      recommendation: "approve" as const,
      keyFindings: [
        "AI analysis unavailable - manual review recommended",
        `${input.files.length} files changed`,
        "Please review the changes manually"
      ],
      estimatedReviewTime: "30 minutes"
    },
    codeQuality: {
      score: 7,
      issues: [],
      suggestions: ["Please review the code manually as AI analysis failed"]
    },
    security: {
      score: 8,
      vulnerabilities: [],
      recommendations: ["Manual security review recommended"]
    },
    performance: {
      score: 7,
      issues: [],
      optimizations: ["Performance review needed"]
    },
    architecture: {
      score: 7,
      insights: [],
      consistencyScore: 7
    },
    projectContext: {
      relatedIssues: [],
      impactedFeatures: [],
      teamNotifications: ["AI analysis failed - manual review needed"],
      conventionViolations: []
    }
  };
}