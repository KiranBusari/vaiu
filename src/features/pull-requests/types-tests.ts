export enum TestType {
  UNIT = "unit",
  INTEGRATION = "integration",
  E2E = "e2e",
  PERFORMANCE = "performance",
  SECURITY = "security",
  ACCESSIBILITY = "accessibility",
  API = "api",
  COMPONENT = "component",
}

export interface TestCase {
  id: string;
  title: string;
  description: string;
  type: TestType;
  targetFile: string;
  suggestedTestFile: string;
  testCode: string;
  prerequisites: string[];
  priority: "low" | "medium" | "high" | "critical";
  reasoning: string;
  edgeCases: string[];
}

export interface TestScenario {
  id: string;
  feature: string;
  description: string;
  testCases: TestCase[];
  affectedFiles: string[];
  riskLevel: "low" | "medium" | "high";
}

export interface TestGenerationSummary {
  totalTestsGenerated: number;
  testsByType: Record<TestType, number>;
  criticalTests: number;
  filesWithTests: number;
  estimatedTestingTime: string;
  coverageAreas: string[];
  recommendations: string[];
}

export interface AITestGeneration {
  id: string;
  prNumber: number;
  prTitle: string;
  prUrl: string;
  projectId: string;

  summary: TestGenerationSummary;
  scenarios: TestScenario[];

  context: {
    filesChanged: Array<{
      filename: string;
      status: "added" | "modified" | "removed";
      additions: number;
      deletions: number;
    }>;
    commitMessages: string[];
    prDescription: string;
    author: string;
  };

  testingStrategy: {
    approach: string;
    focusAreas: string[];
    testingFramework: string;
    runInstructions: string;
  };

  createdAt: string;
  generationVersion: string;
}

export interface TestGenerationStatus {
  status: "pending" | "generating" | "completed" | "error";
  progress?: number;
  currentStep?: string;
  message?: string;
  error?: string;
}

// Persisted test types
export interface PersistedTestCase extends TestCase {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $collectionId: string;
  $databaseId: string;
  $permissions: string[];
  projectId: string;
  prNumber: number;
  scenarioId: string;
  isCustom: boolean; // User created vs AI generated
  isDeleted: boolean;
}

export interface TestManagementData {
  tests: PersistedTestCase[];
  scenarios: TestScenario[];
  summary: TestGenerationSummary;
}
