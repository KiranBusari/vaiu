"use client";

import Link from "next/link";
import { BarChart2, Clock, Users, Zap, ChevronRight } from "lucide-react";

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
              Powerful tools for powerful teams
            </h2>
            <p className="max-w-[900px] text-sm text-blue-500 md:text-base lg:text-base/relaxed xl:text-xl/relaxed">
              Vaiu provides everything you need to take your project management
              to the next level.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 md:gap-6 md:py-12 lg:grid-cols-3">
          {[
            {
              icon: <BarChart2 className="h-8 w-8 md:h-10 md:w-10" />,
              title: "Advanced Analytics",
              description:
                "Gain deep insights into your team's performance with customizable dashboards and real-time metrics.",
            },
            {
              icon: <Clock className="h-8 w-8 md:h-10 md:w-10" />,
              title: "Time Tracking",
              description:
                "Track time spent on tasks and projects to improve estimation accuracy and resource allocation.",
            },
            {
              icon: <Users className="h-8 w-8 md:h-10 md:w-10" />,
              title: "Team Collaboration",
              description:
                "Enhance team communication with integrated chat, comments, and file sharing capabilities.",
            },
            {
              icon: <Zap className="h-8 w-8 md:h-10 md:w-10" />,
              title: "Automation",
              description:
                "Automate repetitive tasks and workflows to save time and reduce manual errors.",
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
                  className="md:h-10 md:w-10"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M9 9h6v6H9z" />
                </svg>
              ),
              title: "Custom Fields",
              description:
                "Create and manage custom fields to tailor vaiu to your specific project requirements.",
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
                  className="md:h-10 md:w-10"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 8v4l3 3" />
                </svg>
              ),
              title: "Reporting",
              description:
                "Generate comprehensive reports to track progress, identify bottlenecks, and make data-driven decisions.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-800 p-4 shadow-lg transition-all hover:-translate-y-1 hover:shadow-purple-500/5 dark:bg-slate-900/50 md:p-6"
            >
              <div className="space-y-3 md:space-y-4">
                <div className="text-blue-600">{feature.icon}</div>
                <h3 className="text-lg font-bold text-white md:text-xl">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 md:text-base">
                  {feature.description}
                </p>
                <Link
                  href="#"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-300 md:text-base"
                >
                  Learn more{" "}
                  <ChevronRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
