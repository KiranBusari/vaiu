"use client";

import {
  GitPullRequest,
  Sparkles,
  GitBranch,
  Video,
  Kanban,
  FileSearch,
  FileText,
  BarChart3,
} from "lucide-react";

export default function BoldDesign() {
  return (
    <section className="w-full py-12 md:py-40" id="features">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-full px-3 py-1 text-5xl font-bold text-gray-500 dark:text-white">
              Features
            </div>
            <h2 className="text-2xl tracking-wide text-gray-500 dark:text-white md:text-3xl">
              Everything you need for collaborative development
            </h2>
            <p className="max-w-[900px] text-sm text-blue-500 md:text-base lg:text-base/relaxed xl:text-xl/relaxed">
              Vaiu provides powerful tools to streamline your GitHub workflow,
              from AI-powered code reviews to real-time team collaboration.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 md:gap-6 md:py-12 lg:grid-cols-3">
          {[
            {
              icon: <Sparkles className="h-8 w-8 md:h-10 md:w-10" />,
              title: "AI-Powered Code Review",
              description:
                "Get intelligent PR analysis with automated code quality, security, and performance assessments powered by advanced AI technology.",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 md:h-10 md:w-10"
                >
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              ),
              title: "Automated Test Generation",
              description:
                "AI generates comprehensive test cases for your PRs - unit, integration, E2E, and more with prioritized recommendations.",
            },
            {
              icon: <FileText className="h-8 w-8 md:h-10 md:w-10" />,
              title: "AI-Powered Summaries",
              description:
                "Generate intelligent summaries of pull requests and issues with impact analysis, key changes, and actionable recommendations.",
            },
            {
              icon: <BarChart3 className="h-8 w-8 md:h-10 md:w-10" />,
              title: "Advanced Analytics & Insights",
              description:
                "Track project metrics, issue statistics, team performance, and GitHub profile analytics with detailed dashboards and real-time data visualization.",
            },
            {
              icon: <GitPullRequest className="h-8 w-8 md:h-10 md:w-10" />,
              title: "Pull Request Management",
              description:
                "Create, review, and manage pull requests seamlessly with an intuitive interface and intelligent workflows.",
            },
            {
              icon: <Kanban className="h-8 w-8 md:h-10 md:w-10" />,
              title: "Advanced Issue Tracking",
              description:
                "Track issues with kanban boards, table views, and calendar layouts. Filter, sort, search, and assign issues with ease.",
            },
            {
              icon: <FileSearch className="h-8 w-8 md:h-10 md:w-10" />,
              title: "GitHub Issues Integration",
              description:
                "Seamlessly fetch and sync issues from your GitHub repositories. Create, manage, and track GitHub issues directly within vaiu.",
            },
            {
              icon: <GitBranch className="h-8 w-8 md:h-10 md:w-10" />,
              title: "Repository Management",
              description:
                "Create new repos or import existing ones. Manage settings, collaborators, and view comprehensive project analytics.",
            },
            {
              icon: <Video className="h-8 w-8 md:h-10 md:w-10" />,
              title: "Real-Time Collaboration",
              description:
                "Connect with your team through audio/video rooms and integrated chat for seamless communication.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-800 p-4 shadow-lg transition-all hover:-translate-y-1 hover:shadow-purple-500/5 dark:bg-slate-900/50 md:p-6"
            >
              <div className="space-y-3 md:space-y-4">
                <div className="text-blue-600">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-black md:text-xl">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 md:text-base">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
