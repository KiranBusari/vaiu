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

## Pull Request Details:
- **Title**: ${input.prTitle}
- **Description**: ${input.prDescription}
- **Repository**: ${input.repoName}
- **Base Branch**: ${input.baseBranch}
- **Head Branch**: ${input.headBranch}
- **Files Changed**: ${input.files.length}

## Files and Changes:
${JSON.stringify(filesInfo, null, 2)}

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
1. **Code Quality**: Look for complexity, maintainability, coding standards, naming conventions
2. **Security**: Check for vulnerabilities, authentication issues, input validation, data exposure
3. **Performance**: Identify potential bottlenecks, inefficient algorithms, resource usage
4. **Architecture**: Evaluate design patterns, code organization, dependency management
5. **Best Practices**: Consider testing, documentation, error handling

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