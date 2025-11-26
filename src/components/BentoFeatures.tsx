"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  GitPullRequest,
  Sparkles,
  GitBranch,
  Video,
  Kanban,
  FileSearch,
  FileText,
  BarChart3,
  CheckCircle2,
  Search,
  FolderTree,
  X,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
type FeatureItem = {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  icon: React.ReactNode;
  header: React.ReactNode;
  className?: string;
  cta?: string;
};

// --- Visual Components (Skeletons/Micro-interactions) ---

const CodeReviewVisual = () => {
  return (
    <div className="relative flex h-full w-full flex-col gap-2 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
      <div className="mb-2 flex gap-1.5">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500/20" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/20" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-500/20" />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.3, width: "100%" }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
          className="h-2 rounded-full bg-neutral-700"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
      <motion.div
        className="absolute left-0 top-0 h-1 w-full bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 3, ease: "linear", repeat: Infinity }}
      />
      <div className="absolute bottom-3 right-3 rounded border border-blue-500/30 bg-blue-500/20 px-2 py-1 text-[10px] text-blue-400 backdrop-blur-sm">
        Score: 98/100
      </div>
    </div>
  );
};

const TestGenVisual = () => {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 p-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.5, backgroundColor: "#262626" }}
            animate={{
              scale: [0.5, 1.1, 1],
              backgroundColor: ["#262626", "#22c55e"],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 2,
              delay: i * 0.4,
            }}
            className="flex h-5 w-5 items-center justify-center rounded-full"
          >
            <CheckCircle2 className="h-3 w-3 text-black" />
          </motion.div>
          <div className="h-2 w-24 rounded-full bg-neutral-800" />
        </div>
      ))}
    </div>
  );
};

const SummaryVisual = () => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center p-4">
      <div className="absolute inset-0 flex flex-col gap-2 p-4 opacity-20">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-1.5 w-full rounded-full bg-neutral-500" />
        ))}
      </div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
        className="z-10 flex w-[90%] flex-col gap-2 rounded-lg border border-neutral-700 bg-neutral-900/90 p-3 shadow-xl backdrop-blur-md"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-3 w-3 text-purple-400" />
          <div className="h-2 w-16 rounded-full bg-purple-500/30" />
        </div>
        <div className="h-1.5 w-full rounded-full bg-neutral-700" />
        <div className="h-1.5 w-2/3 rounded-full bg-neutral-700" />
      </motion.div>
    </div>
  );
};

const AnalyticsVisual = () => {
  return (
    <div className="flex h-full w-full items-end justify-between gap-2 px-4 pb-4 pt-8">
      {[40, 70, 50, 90, 65].map((height, i) => (
        <motion.div
          key={i}
          initial={{ height: "10%" }}
          animate={{ height: `${height}%` }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.1,
            ease: "easeInOut",
          }}
          className={`w-full rounded-t-sm ${
            i === 3 ? "bg-blue-500" : "bg-neutral-800"
          }`}
        />
      ))}
    </div>
  );
};

const PRVisual = () => {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-4">
      <svg
        viewBox="0 0 100 60"
        className="h-full w-full stroke-neutral-700"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
      >
        {/* Main branch */}
        <line x1="0" y1="30" x2="100" y2="30" />

        {/* Feature branch */}
        <motion.path
          d="M 20 30 C 35 30 35 10 50 10 L 70 10 C 85 10 85 30 100 30"
          className="stroke-blue-500"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Nodes */}
        <circle
          cx="20"
          cy="30"
          r="3"
          className="fill-neutral-900 stroke-neutral-500"
        />
        <motion.circle
          cx="50"
          cy="10"
          r="3"
          className="fill-neutral-900 stroke-blue-500"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.5,
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 1.5,
          }}
        />
        <circle
          cx="100"
          cy="30"
          r="3"
          className="fill-neutral-900 stroke-neutral-500"
        />
      </svg>
      <div className="absolute right-4 top-4 rounded border border-purple-500/30 bg-purple-500/20 px-2 py-0.5 text-[10px] text-purple-300">
        Merged
      </div>
    </div>
  );
};

const KanbanVisual = () => {
  return (
    <div className="flex h-full w-full gap-2 p-3 opacity-90">
      {/* Column 1 */}
      <div className="flex w-1/3 flex-col gap-2 rounded bg-neutral-800/30 p-1">
        <div className="mb-1 h-1.5 w-10 rounded-full bg-neutral-700" />
        <div className="h-8 w-full rounded border border-neutral-700 bg-neutral-800" />
        <div className="h-8 w-full rounded border border-neutral-700 bg-neutral-800" />
      </div>
      {/* Column 2 */}
      <div className="flex w-1/3 flex-col gap-2 rounded bg-neutral-800/30 p-1">
        <div className="mb-1 h-1.5 w-10 rounded-full bg-neutral-700" />
        <motion.div
          layout
          initial={{ y: 0 }}
          animate={{ y: [0, 40, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-full rounded border border-blue-500/30 bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
        />
        <div className="h-8 w-full rounded border border-neutral-700 bg-neutral-800" />
      </div>
      {/* Column 3 */}
      <div className="flex w-1/3 flex-col gap-2 rounded bg-neutral-800/30 p-1">
        <div className="mb-1 h-1.5 w-10 rounded-full bg-neutral-700" />
        <div className="h-8 w-full rounded border border-neutral-700 bg-neutral-800" />
      </div>
    </div>
  );
};

const IssuesVisual = () => {
  return (
    <div className="flex h-full w-full flex-col p-4">
      <div className="mb-2 flex items-center gap-2 rounded-md border border-neutral-700 bg-neutral-900 p-1.5">
        <Search className="h-3 w-3 text-neutral-500" />
        <motion.div
          className="h-1 w-1 bg-neutral-500"
          animate={{ height: ["4px", "12px", "4px"] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: i * 0.3,
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className="flex items-center justify-between rounded bg-neutral-800/50 p-1.5 px-2"
          >
            <div className="h-1.5 w-16 rounded-full bg-neutral-600" />
            <div className="h-3 w-3 rounded-full border border-neutral-600" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const RepoVisual = () => {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="relative flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <FolderTree className="h-4 w-4 text-neutral-500" />
          <span className="text-xs text-neutral-400">root</span>
        </div>
        <div className="flex flex-col gap-2 border-l border-neutral-700 pl-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-blue-500/20" />
            <div className="h-1.5 w-12 rounded bg-neutral-600" />
          </div>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="flex flex-col gap-2 overflow-hidden border-l border-neutral-700 pl-4"
          >
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-purple-500/20" />
              <div className="h-1.5 w-10 rounded bg-neutral-600" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-purple-500/20" />
              <div className="h-1.5 w-14 rounded bg-neutral-600" />
            </div>
          </motion.div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-blue-500/20" />
            <div className="h-1.5 w-16 rounded bg-neutral-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

const CollabVisual = () => {
  return (
    <div className="relative h-full w-full overflow-hidden p-4">
      {/* User 1 */}
      <motion.div
        animate={{ x: [0, 40, 10, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/3 top-1/2"
      >
        <div className="absolute -top-6 left-2 rounded bg-blue-500 px-1.5 py-0.5 text-[8px] text-white">
          Dev 1
        </div>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-blue-500"
        >
          <path
            d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      {/* User 2 */}
      <motion.div
        animate={{ x: [0, -30, -10, 0], y: [0, 30, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/3 right-1/3"
      >
        <div className="absolute -top-6 left-2 rounded bg-purple-500 px-1.5 py-0.5 text-[8px] text-white">
          Dev 2
        </div>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-purple-500"
        >
          <path
            d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      {/* Chat Bubbles */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        className="absolute right-4 top-4 rounded-lg rounded-bl-none border border-neutral-700 bg-neutral-800 p-2"
      >
        <div className="h-1.5 w-8 rounded bg-neutral-500" />
      </motion.div>
    </div>
  );
};

// --- Hooks ---

function useOutsideClick(
  ref: React.RefObject<HTMLDivElement | null>,
  callback: (event: Event) => void,
) {
  useEffect(() => {
    const listener = (event: Event) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
}

// --- Main Components ---

interface BentoGridProps {
  className?: string;
  children?: React.ReactNode;
}

const BentoGrid: React.FC<BentoGridProps> = ({ className, children }) => {
  return (
    <div
      className={`mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[10rem] md:grid-cols-3 ${className}`}
    >
      {children}
    </div>
  );
};

interface BentoGridItemProps {
  item: FeatureItem;
  onClick?: () => void;
  isExpandable?: boolean;
}

const BentoGridItem: React.FC<BentoGridItemProps> = ({
  item,
  onClick,
  isExpandable,
}) => {
  const { title, description, header, icon, className } = item;

  return (
    <motion.div
      layoutId={`card-${item.id}`}
      onClick={isExpandable ? onClick : undefined}
      whileHover={
        isExpandable ? { y: -4, transition: { duration: 0.2 } } : { y: -2 }
      }
      className={`group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-transparent bg-white p-4 shadow-input dark:border-white/[0.1] dark:bg-black dark:shadow-none ${className} ${isExpandable ? "cursor-pointer transition-colors hover:border-blue-500/30 hover:shadow-xl" : ""}`}
    >
      <div className="relative flex h-full min-h-[6rem] w-full flex-1 overflow-hidden rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
        {header}
        <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100 dark:bg-black/20" />
        {isExpandable && (
          <div className="absolute bottom-2 right-2 rounded-full bg-black/50 p-1 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover/bento:opacity-100">
            <Search className="h-3 w-3 text-white" />
          </div>
        )}
      </div>
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        <div className="mb-2 text-neutral-600 dark:text-neutral-400">
          {icon}
        </div>
        <div className="mb-1 mt-1 font-sans font-bold text-neutral-600 dark:text-neutral-200">
          {title}
        </div>
        <div className="line-clamp-2 font-sans text-xs font-normal text-neutral-600 dark:text-neutral-400">
          {description}
        </div>
      </div>
    </motion.div>
  );
};

export default function BentoFeatures() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => setSelectedId(null));

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedId(null);
      }
    }

    if (selectedId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId]);

  const features: FeatureItem[] = [
    {
      id: "code-review",
      title: "AI-Powered Code Review",
      description: "Automated quality, security, and performance assessments.",
      longDescription:
        "Our advanced AI analyzes your entire codebase to identify potential bugs, security vulnerabilities, and performance bottlenecks before they reach production. Get line-by-line recommendations, auto-fix suggestions for linting errors, and architectural insights that help you maintain a clean, scalable code base. Integrates seamlessly with your existing CI/CD pipeline.",
      header: <CodeReviewVisual />,
      icon: <Sparkles className="h-4 w-4" />,
      className: "md:col-span-2 md:row-span-2",
      cta: "Analyze Code",
    },
    {
      id: "test-gen",
      title: "Auto Test Gen",
      description: "AI-generated unit and integration tests.",
      header: <TestGenVisual />,
      icon: <CheckCircle2 className="h-4 w-4" />,
      className: "md:col-span-1 md:row-span-1",
    },
    {
      id: "smart-summaries",
      title: "Smart Summaries",
      description: "Concise PR and issue summaries via AI.",
      header: <SummaryVisual />,
      icon: <FileText className="h-4 w-4" />,
      className: "md:col-span-1 md:row-span-1",
    },
    {
      id: "analytics",
      title: "Advanced Analytics",
      description: "Track team performance and project health.",
      header: <AnalyticsVisual />,
      icon: <BarChart3 className="h-4 w-4" />,
      className: "md:col-span-1 md:row-span-1",
    },
    {
      id: "pr-management",
      title: "PR Management",
      description: "Intuitive workflow for merging and reviewing.",
      longDescription:
        "Revolutionize how your team handles Pull Requests. Vaiu provides an intelligent layer over GitHub's PR system, offering automated context checks, reviewer assignment based on code ownership, and a streamlined merge queue. Visualize the impact of changes, detect conflicts early, and merge with confidence using our smart policy engine.",
      header: <PRVisual />,
      icon: <GitPullRequest className="h-4 w-4" />,
      className: "md:col-span-2 md:row-span-1",
      cta: "Manage PRs",
    },
    {
      id: "kanban",
      title: "Kanban Tracking",
      description: "Visual project management boards.",
      longDescription:
        "Stay on top of your tasks with our fully customizable Kanban boards. Features include automated column movements based on PR status, WIP limits to prevent burnout, and smart filtering. Deeply integrated with your codebase, allowing you to transition issues directly from your CLI or IDE.",
      header: <KanbanVisual />,
      icon: <Kanban className="h-4 w-4" />,
      className: "md:col-span-2 md:row-span-1",
      cta: "View Boards",
    },
    {
      id: "github-sync",
      title: "GitHub Sync",
      description: "Seamless two-way issue synchronization.",
      header: <IssuesVisual />,
      icon: <FileSearch className="h-4 w-4" />,
      className: "md:col-span-1 md:row-span-1",
    },
    {
      id: "repo-manager",
      title: "Repo Manager",
      description: "Full repository control and settings.",
      header: <RepoVisual />,
      icon: <GitBranch className="h-4 w-4" />,
      className: "md:col-span-1 md:row-span-1",
    },
    {
      id: "real-time-collab",
      title: "Real-Time Collab",
      description: "Multiplayer editing and voice chat.",
      header: <CollabVisual />,
      icon: <Video className="h-4 w-4" />,
      className: "md:col-span-1 md:row-span-1",
    },
  ];

  const selectedFeature = features.find((f) => f.id === selectedId);

  return (
    <section
      className="relative mx-auto max-w-7xl px-4 py-20 md:px-8"
      id="features"
    >
      <div className="mb-12 space-y-4 text-center">
        <div className="inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-500">
          Features
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          Built for <span className="text-blue-500">velocity</span>
        </h2>
        <p className="mx-auto max-w-[700px] text-neutral-400 md:text-lg">
          Vaiu provides powerful tools to streamline your GitHub workflow, from
          AI-powered code reviews to real-time collaboration.
        </p>
      </div>

      <BentoGrid>
        {features.map((item) => (
          <BentoGridItem
            key={item.id}
            item={item}
            isExpandable={item.className?.includes("col-span-2")}
            onClick={() => setSelectedId(item.id)}
          />
        ))}
      </BentoGrid>

      <AnimatePresence>
        {selectedId && selectedFeature && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-transparent"
              onClick={() => setSelectedId(null)}
            />
            <motion.div
              layoutId={`card-${selectedFeature.id}`}
              ref={ref}
              className="relative flex h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-neutral-800 bg-[#18181b] shadow-2xl md:h-[600px] md:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(null);
                }}
                className="absolute right-4 top-4 z-50 rounded-full bg-neutral-900/50 p-2 text-neutral-400 backdrop-blur-md transition-colors hover:bg-neutral-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Left: Visual (Expanded) */}
              <div className="relative h-64 overflow-hidden border-b border-neutral-800 bg-gradient-to-br from-neutral-900 to-black md:h-full md:w-1/2 md:border-b-0 md:border-r">
                <div className="flex h-full w-full items-center justify-center p-8">
                  <div className="h-full max-h-[300px] w-full">
                    {selectedFeature.header}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-transparent to-transparent md:bg-gradient-to-r" />
              </div>

              {/* Right: Content */}
              <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto p-6 md:p-10">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-2">
                    {selectedFeature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white md:text-3xl">
                    {selectedFeature.title}
                  </h3>
                </div>

                <p className="mb-6 text-lg leading-relaxed text-neutral-300">
                  {selectedFeature.description}
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="space-y-6"
                >
                  <div className="prose prose-invert prose-sm max-w-none">
                    <p className="leading-relaxed text-neutral-400">
                      {selectedFeature.longDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
                      <h4 className="mb-1 text-sm font-medium text-neutral-200">
                        Efficiency
                      </h4>
                      <p className="text-xs text-neutral-500">
                        Boosted by 45% on average
                      </p>
                    </div>
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
                      <h4 className="mb-1 text-sm font-medium text-neutral-200">
                        Integration
                      </h4>
                      <p className="text-xs text-neutral-500">
                        Seamless GitHub connect
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto pt-6">
                    <button className="group flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200">
                      {selectedFeature.cta || "Learn more"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
