"use client";

import { useState } from "react";
import {
    FlaskConical,
    Plus,
    Edit,
    Trash2,
    Copy,
    Check,
    Code2,
    Layers,
    TrendingUp,
    Zap,
    Shield,
    Eye,
    Server,
    FileCode,
    ChevronDown,
    ChevronRight,
    Sparkles,
    Save,
    X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
    useGetPRTests,
    useCreateTest,
    useUpdateTest,
    useDeleteTest,
} from "../api/use-test-management";
import { PersistedTestCase, TestType } from "../types-tests";
import { Skeleton } from "@/components/ui/skeleton";

interface TestManagementTabProps {
    projectId: string;
    prNumber: number;
}

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

const getPriorityColor = (
    priority: string,
): "destructive" | "default" | "secondary" | "outline" => {
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

export function TestManagementTab({
    projectId,
    prNumber,
}: TestManagementTabProps) {
    const [activeTab, setActiveTab] = useState<string>("all");
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [editingTest, setEditingTest] = useState<PersistedTestCase | null>(
        null,
    );
    const [deleteConfirmTest, setDeleteConfirmTest] = useState<string | null>(null);

    const { data: testsData, isLoading } = useGetPRTests(projectId, prNumber);
    const createTestMutation = useCreateTest();
    const updateTestMutation = useUpdateTest();
    const deleteTestMutation = useDeleteTest();

    const tests = testsData?.data || [];

    // Group tests by type
    const testsByType = tests.reduce(
        (acc, test) => {
            if (!acc[test.type]) {
                acc[test.type] = [];
            }
            acc[test.type].push(test);
            return acc;
        },
        {} as Record<TestType, PersistedTestCase[]>,
    );

    // Filter tests by tab
    const filteredTests =
        activeTab === "all"
            ? tests
            : activeTab === "custom"
                ? tests.filter((t) => t.isCustom)
                : activeTab === "ai-generated"
                    ? tests.filter((t) => !t.isCustom)
                    : testsByType[activeTab as TestType] || [];

    const handleCreateTest = () => {
        setEditingTest(null);
        setShowCreateDialog(true);
    };

    const handleEditTest = (test: PersistedTestCase) => {
        setEditingTest(test);
        setShowCreateDialog(true);
    };

    const handleDeleteTest = (testId: string) => {
        setDeleteConfirmTest(testId);
    };

    const confirmDelete = async () => {
        if (deleteConfirmTest) {
            await deleteTestMutation.mutateAsync({
                param: { projectId, testId: deleteConfirmTest },
            });
            setDeleteConfirmTest(null);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4 p-6">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 overflow-hidden p-6">
            <div className="flex flex-col gap-2 pr-8">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <FlaskConical className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold">Test Cases</h2>
                            <Badge variant="outline" className="ml-2">
                                {tests.length} Total
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Pull Request #{prNumber}
                        </p>
                    </div>
                    <Button onClick={handleCreateTest} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Test
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Test Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{tests.length}</div>
                            <div className="text-xs text-muted-foreground">Total Tests</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">
                                {tests.filter((t) => !t.isCustom).length}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                AI Generated
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">
                                {tests.filter((t) => t.isCustom).length}
                            </div>
                            <div className="text-xs text-muted-foreground">Custom</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">
                                {tests.filter((t) => t.priority === "critical").length}
                            </div>
                            <div className="text-xs text-muted-foreground">Critical</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <ScrollArea className="w-full">
                    <TabsList className="inline-flex h-10 w-max items-center justify-start rounded-md bg-muted p-1 text-muted-foreground">
                        <TabsTrigger value="all">All Tests</TabsTrigger>
                        <TabsTrigger value="ai-generated">
                            <Sparkles className="mr-1 h-3 w-3" />
                            AI Generated
                        </TabsTrigger>
                        <TabsTrigger value="custom">Custom</TabsTrigger>
                        {Object.values(TestType).map((type) => {
                            const count = testsByType[type]?.length || 0;
                            if (count === 0) return null;
                            return (
                                <TabsTrigger key={type} value={type} className="capitalize">
                                    {getTestTypeIcon(type)}
                                    <span className="ml-1">{type}</span>
                                    <Badge variant="secondary" className="ml-2 h-5 px-1">
                                        {count}
                                    </Badge>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                </ScrollArea>

                <TabsContent value={activeTab} className="mt-6 space-y-4">
                    {filteredTests.length === 0 ? (
                        <Card>
                            <CardContent className="flex min-h-[200px] items-center justify-center">
                                <div className="text-center">
                                    <FlaskConical className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                    <p className="text-muted-foreground">
                                        No tests found. Create your first test or generate tests
                                        using AI.
                                    </p>
                                    <Button
                                        onClick={handleCreateTest}
                                        variant="outline"
                                        className="mt-4"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Test
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {filteredTests.map((test) => (
                                <TestCard
                                    key={test.$id}
                                    test={test}
                                    onEdit={handleEditTest}
                                    onDelete={handleDeleteTest}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Create/Edit Dialog */}
            <TestFormDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
                test={editingTest}
                projectId={projectId}
                prNumber={prNumber}
                onSubmit={async (data) => {
                    if (editingTest) {
                        await updateTestMutation.mutateAsync({
                            param: { projectId, testId: editingTest.$id },
                            json: data,
                        });
                    } else {
                        await createTestMutation.mutateAsync({
                            param: { projectId, prNumber: prNumber.toString() },
                            json: {
                                ...data,
                                scenarioId: data.scenarioId || "custom",
                            },
                        });
                    }
                    setShowCreateDialog(false);
                }}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirmTest} onOpenChange={(open) => !open && setDeleteConfirmTest(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Test</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this test? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteConfirmTest(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={deleteTestMutation.isPending}
                        >
                            {deleteTestMutation.isPending ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

interface TestCardProps {
    test: PersistedTestCase;
    onEdit: (test: PersistedTestCase) => void;
    onDelete: (testId: string) => void;
}

function TestCard({ test, onEdit, onDelete }: TestCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

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
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <Card>
                <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                            {isOpen ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                            <div className="flex items-center gap-2">
                                {getTestTypeIcon(test.type)}
                                <span className="font-medium">{test.title}</span>
                            </div>
                            {test.isCustom && (
                                <Badge variant="outline" className="text-xs">
                                    Custom
                                </Badge>
                            )}
                            {!test.isCustom && (
                                <Badge variant="outline" className="gap-1 text-xs">
                                    <Sparkles className="h-3 w-3" />
                                    AI
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant={getPriorityColor(test.priority)}>
                                {test.priority}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                                {test.type}
                            </Badge>
                        </div>
                    </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <div className="space-y-4 border-t border-border p-4">
                        <div>
                            <h4 className="mb-1 text-sm font-semibold">Description</h4>
                            <p className="text-sm text-muted-foreground">
                                {test.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <h4 className="mb-1 font-semibold">Target File</h4>
                                <code className="text-xs text-muted-foreground">
                                    {test.targetFile}
                                </code>
                            </div>
                            <div>
                                <h4 className="mb-1 font-semibold">Test File</h4>
                                <code className="text-xs text-muted-foreground">
                                    {test.suggestedTestFile}
                                </code>
                            </div>
                        </div>

                        <div>
                            <h4 className="mb-1 text-sm font-semibold">Reasoning</h4>
                            <p className="text-sm text-muted-foreground">{test.reasoning}</p>
                        </div>

                        {test.prerequisites.length > 0 && (
                            <div>
                                <h4 className="mb-2 text-sm font-semibold">Prerequisites</h4>
                                <div className="flex flex-wrap gap-2">
                                    {test.prerequisites.map((prereq, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {prereq}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {test.edgeCases.length > 0 && (
                            <div>
                                <h4 className="mb-2 text-sm font-semibold">Edge Cases</h4>
                                <ul className="space-y-1">
                                    {test.edgeCases.map((edgeCase, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-2 text-sm text-muted-foreground"
                                        >
                                            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
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
                                    onClick={() => copyToClipboard(test.testCode, test.$id)}
                                >
                                    {copiedId === test.$id ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            <ScrollArea className="h-[400px] w-full">
                                <pre className="max-w-full overflow-x-auto rounded-lg border border-border bg-muted p-4 pb-6 text-xs font-mono leading-relaxed">
                                    <code className="block whitespace-pre-wrap break-words">
                                        {test.testCode.replace(/\\n/g, '\n')}
                                    </code>
                                </pre>
                            </ScrollArea>
                        </div>

                        <div className="flex justify-end gap-2 border-t pt-4 mt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(test)}
                                className="gap-2"
                            >
                                <Edit className="h-4 w-4" />
                                Edit
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDelete(test.$id)}
                                className="gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}

interface TestFormData {
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
    scenarioId: string;
}

interface TestFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    test: PersistedTestCase | null;
    projectId: string;
    prNumber: number;
    onSubmit: (data: TestFormData) => Promise<void>;
}

function TestFormDialog({
    open,
    onOpenChange,
    test,
    onSubmit,
}: TestFormDialogProps) {
    const [formData, setFormData] = useState({
        title: test?.title || "",
        description: test?.description || "",
        type: test?.type || TestType.UNIT,
        targetFile: test?.targetFile || "",
        suggestedTestFile: test?.suggestedTestFile || "",
        testCode: test?.testCode || "",
        prerequisites: test?.prerequisites?.join(", ") || "",
        priority: test?.priority || "medium",
        reasoning: test?.reasoning || "",
        edgeCases: test?.edgeCases?.join(", ") || "",
        scenarioId: test?.scenarioId || "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit({
                title: formData.title,
                description: formData.description,
                type: formData.type,
                targetFile: formData.targetFile,
                suggestedTestFile: formData.suggestedTestFile,
                testCode: formData.testCode,
                prerequisites: formData.prerequisites
                    .split(",")
                    .map((p) => p.trim())
                    .filter(Boolean),
                priority: formData.priority as "low" | "medium" | "high" | "critical",
                reasoning: formData.reasoning,
                edgeCases: formData.edgeCases
                    .split(",")
                    .map((e) => e.trim())
                    .filter(Boolean),
                scenarioId: formData.scenarioId,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{test ? "Edit Test" : "Create New Test"}</DialogTitle>
                    <DialogDescription>
                        {test
                            ? "Update the test case details below."
                            : "Create a new custom test case for this pull request."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                placeholder="Test title"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Test Type *</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, type: value as TestType })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(TestType).map((type) => (
                                        <SelectItem key={type} value={type} className="capitalize">
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            placeholder="Describe what this test covers"
                            rows={3}
                            required
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="targetFile">Target File *</Label>
                            <Input
                                id="targetFile"
                                value={formData.targetFile}
                                onChange={(e) =>
                                    setFormData({ ...formData, targetFile: e.target.value })
                                }
                                placeholder="src/components/Button.tsx"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="suggestedTestFile">Test File *</Label>
                            <Input
                                id="suggestedTestFile"
                                value={formData.suggestedTestFile}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        suggestedTestFile: e.target.value,
                                    })
                                }
                                placeholder="src/components/Button.test.tsx"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="testCode">Test Code *</Label>
                        <Textarea
                            id="testCode"
                            value={formData.testCode}
                            onChange={(e) =>
                                setFormData({ ...formData, testCode: e.target.value })
                            }
                            placeholder="test('should render button', () => { ... })"
                            rows={10}
                            className="font-mono text-sm"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reasoning">Reasoning *</Label>
                        <Textarea
                            id="reasoning"
                            value={formData.reasoning}
                            onChange={(e) =>
                                setFormData({ ...formData, reasoning: e.target.value })
                            }
                            placeholder="Why this test is important..."
                            rows={2}
                            required
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="prerequisites">
                                Prerequisites (comma-separated)
                            </Label>
                            <Input
                                id="prerequisites"
                                value={formData.prerequisites}
                                onChange={(e) =>
                                    setFormData({ ...formData, prerequisites: e.target.value })
                                }
                                placeholder="setup, config, mocks"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority *</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, priority: value as "low" | "medium" | "high" | "critical" })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edgeCases">Edge Cases (comma-separated)</Label>
                        <Input
                            id="edgeCases"
                            value={formData.edgeCases}
                            onChange={(e) =>
                                setFormData({ ...formData, edgeCases: e.target.value })
                            }
                            placeholder="null input, empty array, max value"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            <Save className="mr-2 h-4 w-4" />
                            {isSubmitting
                                ? "Saving..."
                                : test
                                    ? "Update Test"
                                    : "Create Test"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
