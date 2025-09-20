"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, RadialBar, RadialBarChart, Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useGetPullRequests } from "@/features/pull-requests/api/use-get-pull-requests";
import { useGetIssues } from "@/features/issues/api/use-get-tasks";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useProjectId } from "@/features/projects/hooks/use-projectId";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import { IssueStatus, Issue } from "@/features/issues/types";
import { PullRequest, PrStatus } from "@/features/pull-requests/types";
import { differenceInDays, differenceInHours, formatDistanceToNow } from 'date-fns';

// --- Data Processing Functions (Pull Requests) ---
const processVelocityData = (documents: PullRequest[]) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const dailyData = new Map<string, { opened: number; merged: number }>();
    for (let i = 0; i < 7; i++) {
        const date = new Date(sevenDaysAgo);
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        dailyData.set(dateString, { opened: 0, merged: 0 });
    }
    documents.forEach(pr => {
        const createdAt = new Date(pr.$createdAt);
        if (createdAt >= sevenDaysAgo) {
            const dateString = createdAt.toISOString().split('T')[0];
            if (dailyData.has(dateString)) dailyData.get(dateString)!.opened += 1;
        }
        if (pr.$mergedAt) {
            const mergedAt = new Date(pr.$mergedAt);
            if (mergedAt >= sevenDaysAgo) {
                const dateString = mergedAt.toISOString().split('T')[0];
                if (dailyData.has(dateString)) dailyData.get(dateString)!.merged += 1;
            }
        }
    });
    return Array.from(dailyData.entries()).map(([date, counts]) => ({ date, ...counts }));
};
const processPrStatusData = (documents: PullRequest[]) => {
    const statusCounts = { [PrStatus.OPEN]: 0, [PrStatus.MERGED]: 0, [PrStatus.CLOSED]: 0 };
    documents.forEach(pr => { if (pr.status in statusCounts) statusCounts[pr.status as PrStatus]++; });
    return [
        { name: 'Merged', value: statusCounts[PrStatus.MERGED], fill: 'hsl(var(--chart-1))' },
        { name: 'Open', value: statusCounts[PrStatus.OPEN], fill: 'hsl(var(--chart-2))' },
        { name: 'Closed', value: statusCounts[PrStatus.CLOSED], fill: 'hsl(var(--chart-3))' },
    ].filter(item => item.value > 0);
};
const calculatePrKpis = (documents: PullRequest[]) => {
    const openPrs = documents.filter(pr => pr.status === PrStatus.OPEN);
    const mergedPrs = documents.filter(pr => pr.status === PrStatus.MERGED && pr.$mergedAt && pr.$createdAt);
    const totalMergeTime = mergedPrs.reduce((acc, pr) => acc + differenceInHours(new Date(pr.$mergedAt), new Date(pr.$createdAt)), 0);
    const avgMergeTimeHours = mergedPrs.length > 0 ? totalMergeTime / mergedPrs.length : 0;
    const stalePrs = openPrs.filter(pr => differenceInDays(new Date(), new Date(pr.$updatedAt)) > 3);
    return {
        openPrCount: openPrs.length,
        avgMergeTime: avgMergeTimeHours > 24 ? `${(avgMergeTimeHours / 24).toFixed(1)} days` : `${avgMergeTimeHours.toFixed(1)} hours`,
        stalePrCount: stalePrs.length,
        stalePrs: stalePrs.sort((a, b) => new Date(a.$updatedAt).getTime() - new Date(b.$updatedAt).getTime()),
    };
}
const processPrAuthorData = (documents: PullRequest[]) => {
    const authorCounts = new Map<string, number>();
    documents.forEach(pr => { authorCounts.set(pr.author, (authorCounts.get(pr.author) || 0) + 1); });
    return Array.from(authorCounts.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 10);
}

// --- Data Processing Functions (Issues) ---
const processIssueStatusData = (documents: Issue[]) => {
    const statusCounts = { [IssueStatus.BACKLOG]: 0, [IssueStatus.TODO]: 0, [IssueStatus.IN_PROGRESS]: 0, [IssueStatus.IN_REVIEW]: 0, [IssueStatus.DONE]: 0 };
    documents.forEach(issue => { if (issue.status in statusCounts) statusCounts[issue.status as IssueStatus]++; });
    return [
        { name: 'Backlog', value: statusCounts.BACKLOG, fill: 'hsl(var(--chart-5))' },
        { name: 'To Do', value: statusCounts.TODO, fill: 'hsl(var(--chart-4))' },
        { name: 'In Progress', value: statusCounts.IN_PROGRESS, fill: 'hsl(var(--chart-3))' },
        { name: 'In Review', value: statusCounts.IN_REVIEW, fill: 'hsl(var(--chart-2))' },
        { name: 'Done', value: statusCounts.DONE, fill: 'hsl(var(--chart-1))' },
    ].filter(item => item.value > 0);
}
const calculateIssueKpis = (documents: Issue[]) => {
    const openIssues = documents.filter(issue => issue.status !== IssueStatus.DONE);
    const doneIssues = documents.filter(issue => issue.status === IssueStatus.DONE);
    return {
        openIssueCount: openIssues.length,
        doneIssueCount: doneIssues.length,
    };
}

export default function AnalyticsDashboard() {
    const projectId = useProjectId();

    if (!projectId) {
        return <SelectProjectMessage />
    }

    return (
        <div className="p-4 md:p-8 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Project Analytics</h1>
            <Tabs defaultValue="pull-requests">
                <TabsList>
                    <TabsTrigger value="pull-requests">Pull Requests</TabsTrigger>
                    <TabsTrigger value="issues">Issues</TabsTrigger>
                </TabsList>
                <TabsContent value="pull-requests" className="mt-4">
                    <PullRequestAnalytics />
                </TabsContent>
                <TabsContent value="issues" className="mt-4">
                    <IssueAnalytics />
                </TabsContent>
            </Tabs>
        </div>
    );
}

// --- Pull Request Analytics Component ---
const PullRequestAnalytics = () => {
    const workspaceId = useWorkspaceId();
    const projectId = useProjectId();
    const { data, isLoading, isError } = useGetPullRequests({ workspaceId: workspaceId!, projectId: projectId!, enabled: !!projectId });

    const processedData = useMemo(() => {
        if (!data?.documents) return null;
        return {
            velocity: processVelocityData(data.documents),
            status: processPrStatusData(data.documents),
            kpis: calculatePrKpis(data.documents),
            authors: processPrAuthorData(data.documents),
        }
    }, [data]);

    if (isLoading) return <DashboardSkeleton />;
    if (isError || !processedData) return <DashboardError />;

    const { velocity, status, kpis, authors } = processedData;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard title="Open PRs" value={kpis.openPrCount} />
                <KpiCard title="Avg Merge Time" value={kpis.avgMergeTime} />
                <KpiCard title="Stale PRs" value={kpis.stalePrCount} />
                <KpiCard title="Merged This Week" value={velocity.reduce((acc, day) => acc + day.merged, 0)} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-1 lg:col-span-2"><CardHeader><CardTitle>PR Velocity</CardTitle><CardDescription>Opened vs. Merged PRs over the last 7 days.</CardDescription></CardHeader><CardContent><ChartContainer config={{}} className="h-[300px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={velocity}><CartesianGrid vertical={false} /><XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} /><YAxis /><Tooltip content={<ChartTooltipContent />} /><Legend /><Bar dataKey="opened" fill="hsl(var(--chart-2))" radius={4} name="Opened" /><Bar dataKey="merged" fill="hsl(var(--chart-1))" radius={4} name="Merged" /></BarChart></ResponsiveContainer></ChartContainer></CardContent></Card>
                <Card><CardHeader><CardTitle>PR Status</CardTitle><CardDescription>Distribution of all PRs.</CardDescription></CardHeader><CardContent><ChartContainer config={{}} className="h-[300px] w-full"><ResponsiveContainer width="100%" height="100%"><RadialBarChart innerRadius="30%" outerRadius="100%" data={status} startAngle={90} endAngle={-270}><RadialBar background dataKey="value" /><Tooltip content={<ChartTooltipContent />} /><Legend /></RadialBarChart></ResponsiveContainer></ChartContainer></CardContent></Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Top Contributors</CardTitle>
                        <CardDescription>Top 10 authors by PR count.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={authors} layout="vertical">
                                    <CartesianGrid horizontal={false} />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={80} tickLine={false} axisLine={false} />
                                    <Tooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="count" fill="hsl(var(--chart-4))" radius={4} name="PRs" />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <StalePullRequestsCard stalePrs={kpis.stalePrs} />
            </div>
        </div>
    );
}

// --- Stale Pull Requests Card Component ---

function StalePullRequestsCard({ stalePrs }: { stalePrs: PullRequest[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Stale Pull Requests</CardTitle>
                <CardDescription>PRs with no updates in over 3 days.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Pull Request</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Last Updated</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stalePrs.map((pr: PullRequest) => (
                            <TableRow key={pr.$id}>
                                <TableCell>
                                    <a
                                        href={pr.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                    >
                                        #{pr.number} {pr.title}
                                    </a>
                                </TableCell>
                                <TableCell>{pr.author}</TableCell>
                                <TableCell>
                                    {formatDistanceToNow(new Date(pr.$updatedAt), { addSuffix: true })}
                                </TableCell>
                            </TableRow>
                        ))}
                        {stalePrs.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">
                                    No stale PRs found. Great job!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
// --- Issue Analytics Component ---
const IssueAnalytics = () => {
    const workspaceId = useWorkspaceId();
    const projectId = useProjectId();
    const { data, isLoading, isError } = useGetIssues({ workspaceId: workspaceId!, projectId: projectId!, enabled: !!projectId });

    const processedData = useMemo(() => {
        if (!data?.documents) return null;
        return {
            status: processIssueStatusData(data.documents),
            kpis: calculateIssueKpis(data.documents),
        }
    }, [data]);

    if (isLoading) return <DashboardSkeleton />;
    if (isError || !processedData) return <DashboardError />;

    const { status, kpis } = processedData;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard title="Open Issues" value={kpis.openIssueCount} />
                <KpiCard title="Issues Completed" value={kpis.doneIssueCount} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader><CardTitle>Issues By Status</CardTitle><CardDescription>Current distribution of all issues.</CardDescription></CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={status} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                        {status.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                    </Pie>
                                    <Tooltip content={<ChartTooltipContent />} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// --- Helper Components ---
const KpiCard = ({ title, value }: { title: string, value: string | number }) => (
    <Card>
        <CardHeader className="pb-2">
            <CardDescription>{title}</CardDescription>
            <CardTitle className="text-3xl">{value}</CardTitle>
        </CardHeader>
    </Card>
)

export const DashboardSkeleton = () => (
    <div className="p-4 md:p-8 space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="col-span-1 lg:col-span-2 h-[350px]" />
            <Skeleton className="h-[350px]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[350px]" />
            <Skeleton className="h-[350px]" />
        </div>
    </div>
);

const DashboardError = () => (
    <div className="p-4 md:p-8 text-center text-red-500">
        <h2 className="text-xl font-semibold">Failed to load analytics data.</h2>
        <p>Please ensure the project is correctly configured and try again later.</p>
    </div>
);

const SelectProjectMessage = () => (
    <div className="p-4 md:p-8 h-full flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold">No Project Selected</h2>
        <p className="text-muted-foreground">Please select a project from the sidebar to view its analytics dashboard.</p>
    </div>
);
