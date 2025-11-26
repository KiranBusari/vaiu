"use client";

import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import {
  GitPullRequest,
  Sparkles,
  GitBranch,
  Video,
  Kanban,
  FileSearch,
  BarChart3,
  Search,
  X,
  ArrowRight,
  Terminal,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Lazy Load Visuals ---
const CodeReviewVisual = lazy(() =>
  import("./BentoVisuals").then((m) => ({ default: m.CodeReviewVisual })),
);
const TestGenVisual = lazy(() =>
  import("./BentoVisuals").then((m) => ({ default: m.TestGenVisual })),
);
const SummaryVisual = lazy(() =>
  import("./BentoVisuals").then((m) => ({ default: m.SummaryVisual })),
);
const AnalyticsVisual = lazy(() =>
  import("./BentoVisuals").then((m) => ({ default: m.AnalyticsVisual })),
);
const PRVisual = lazy(() =>
  import("./BentoVisuals").then((m) => ({ default: m.PRVisual })),
);
const KanbanVisual = lazy(() =>
  import("./BentoVisuals").then((m) => ({ default: m.KanbanVisual })),
);
const IssuesVisual = lazy(() =>
  import("./BentoVisuals").then((m) => ({ default: m.IssuesVisual })),
);
const RepoVisual = lazy(() =>
  import("./BentoVisuals").then((m) => ({ default: m.RepoVisual })),
);
const CollabVisual = lazy(() =>
  import("./BentoVisuals").then((m) => ({ default: m.CollabVisual })),
);

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
  category?: string;
};

// --- Helper Components ---
const VisualSkeleton = () => (
  <div className="flex h-full w-full animate-pulse items-center justify-center border-b border-neutral-800 bg-neutral-900">
    <div className="h-8 w-8 rounded-full bg-neutral-800" />
  </div>
);

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
      className={`mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-4 ${className}`}
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
  const { title, description, header, icon, className, category } = item;

  return (
    <motion.div
      layoutId={`card-${item.id}`}
      onClick={isExpandable ? onClick : undefined}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={
        isExpandable ? { y: -5, transition: { duration: 0.2 } } : { y: -2 }
      }
      className={`group/bento relative flex flex-col justify-between overflow-hidden rounded-3xl border border-neutral-800 bg-black shadow-lg transition-all duration-300 hover:border-neutral-700 hover:shadow-2xl hover:shadow-neutral-900/50 ${className} ${isExpandable ? "cursor-pointer" : ""}`}
    >
      {/* Visual Header - Taking up more space for impact */}
      <div className="relative h-[60%] w-full overflow-hidden bg-neutral-950">
        <Suspense fallback={<VisualSkeleton />}>{header}</Suspense>

        {/* Overlay for Expandable Items */}
        {isExpandable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover/bento:opacity-100">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur-md">
              <Search className="h-4 w-4" />
              <span>Explore</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-[40%] flex-col justify-between bg-neutral-900/50 p-6 backdrop-blur-sm transition-colors group-hover/bento:bg-neutral-900/80">
        <div className="flex items-start justify-between">
          <div>
            {category && (
              <span className="mb-2 inline-block rounded-full border border-neutral-800 bg-neutral-800/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                {category}
              </span>
            )}
            <h3 className="text-xl font-bold text-neutral-100">{title}</h3>
          </div>
          <div className="rounded-lg border border-neutral-700/50 bg-neutral-800/50 p-2 text-neutral-300">
            {icon}
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-neutral-400">
          {description}
        </p>
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
      title: "AI Code Review",
      description: "Automated deep analysis for quality and security.",
      longDescription:
        "Our advanced AI analyzes your entire codebase to identify potential bugs, security vulnerabilities, and performance bottlenecks before they reach production. Get line-by-line recommendations, auto-fix suggestions for linting errors, and architectural insights that help you maintain a clean, scalable code base.",
      header: <CodeReviewVisual />,
      icon: <Terminal className="h-4 w-4" />,
      className: "md:col-span-2 md:row-span-1 min-h-[300px] ",
      category: "Automation",
      cta: "Start Review",
    },
    {
      id: "analytics",
      title: "Velocity Analytics",
      description: "Deep insights into team performance and health.",
      header: <AnalyticsVisual />,
      icon: <BarChart3 className="h-4 w-4" />,
      className: "md:col-span-1 md:row-span-1 min-h-[320px]",
      category: "Metrics",
    },
    {
      id: "pr-management",
      title: "Smart PR Manager",
      description: "Automated context checks and merge queues.",
      longDescription:
        "Revolutionize how your team handles Pull Requests. Vaiu provides an intelligent layer over GitHub's PR system, offering automated context checks, reviewer assignment based on code ownership, and a streamlined merge queue.",
      header: <PRVisual />,
      icon: <GitPullRequest className="h-4 w-4" />,
      className: "md:col-span-1 md:row-span-1 min-h-[320px]",
      category: "Workflow",
      cta: "Manage PRs",
    },
    {
      id: "test-gen",
      title: "Auto Test Gen",
      description: "AI-generated unit tests.",
      header: <TestGenVisual />,
      icon: <Activity className="h-4 w-4" />,
      className: "md:col-span-1 md:row-span-1 min-h-[320px]",
      category: "Quality",
    },
    {
      id: "smart-summaries",
      title: "Auto Summaries",
      description: "Instant PR and issue summarization.",
      header: <SummaryVisual />,
      icon: <Sparkles className="h-4 w-4" />,
      className: "md:col-span-1 md:row-span-1 min-h-[320px]",
      category: "GenAI",
    },
    {
      id: "kanban",
      title: "Unified Kanban",
      description: "Project management synced with code.",
      longDescription:
        "Stay on top of your tasks with our fully customizable Kanban boards. Features include automated column movements based on PR status, WIP limits to prevent burnout, and smart filtering.",
      header: <KanbanVisual />,
      icon: <Kanban className="h-4 w-4" />,
      className: "md:col-span-2 md:row-span-1 min-h-[320px]",
      category: "Planning",
      cta: "View Boards",
    },
    {
      id: "github-sync",
      title: "2-Way Sync",
      description: "Seamless GitHub issue synchronization.",
      header: <IssuesVisual />,
      icon: <FileSearch className="h-4 w-4" />,
      className: "md:col-span-2 md:row-span-1 min-h-[320px]",
      category: "Integration",
    },
    {
      id: "real-time-collab",
      title: "Live Collab",
      description: "Multiplayer editing and presence.",
      header: <CollabVisual />,
      icon: <Video className="h-4 w-4" />,
      className: "md:col-span-1 md:row-span-1 min-h-[320px]",
      category: "Team",
    },
    {
      id: "repo-manager",
      title: "Repo Control",
      description: "Advanced repository management settings.",
      header: <RepoVisual />,
      icon: <GitBranch className="h-4 w-4" />,
      className: "md:col-span-1 md:row-span-1 min-h-[320px]",
      category: "Admin",
    },
  ];

  const selectedFeature = features.find((f) => f.id === selectedId);

  return (
    <section
      className="relative mx-auto max-w-7xl px-4 py-24 md:px-8"
      id="features"
    >
      <div className="mb-20 space-y-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
        >
          Engineered for <span className="text-blue-500">Velocity</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-2xl text-sm text-neutral-400 md:text-lg"
        >
          A complete toolkit designed to accelerate your development workflow,
          from intelligent code reviews to seamless deployment synchronization.
        </motion.p>
      </div>

      <BentoGrid>
        {features.map((item) => (
          <BentoGridItem
            key={item.id}
            item={item}
            isExpandable={!!item.longDescription}
            onClick={() => setSelectedId(item.id)}
          />
        ))}
      </BentoGrid>

      <AnimatePresence>
        {selectedId && selectedFeature && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8">
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
              className="relative flex h-[80vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl md:h-[600px] md:flex-row"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(null);
                }}
                className="absolute right-6 top-6 z-50 rounded-full bg-black/50 p-2 text-neutral-400 backdrop-blur-md transition-colors hover:bg-neutral-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Left: Visual (Expanded) */}
              <div className="relative h-64 w-full overflow-hidden border-b border-neutral-800 bg-black md:h-full md:w-1/2 md:border-b-0 md:border-r">
                <div className="flex h-full w-full items-center justify-center p-8">
                  <div className="h-full w-full">
                    <Suspense fallback={<VisualSkeleton />}>
                      {selectedFeature.header}
                    </Suspense>
                  </div>
                </div>
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80" />
              </div>

              {/* Right: Content */}
              <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto bg-neutral-900 p-8 md:p-12">
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-xl border border-neutral-800 bg-neutral-800/50 p-3 text-blue-400 shadow-inner">
                    {selectedFeature.icon}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">
                      {selectedFeature.title}
                    </h3>
                    {selectedFeature.category && (
                      <p className="mt-1 text-sm font-medium uppercase tracking-widest text-neutral-500">
                        {selectedFeature.category}
                      </p>
                    )}
                  </div>
                </div>

                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="text-xl leading-relaxed text-neutral-300">
                    {selectedFeature.description}
                  </p>
                  <div className="my-8 h-px w-full bg-neutral-800" />
                  <p className="text-base leading-relaxed text-neutral-400">
                    {selectedFeature.longDescription}
                  </p>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4 pt-8">
                  <div className="rounded-xl border border-neutral-800 bg-neutral-800/20 p-4">
                    <div className="mb-1 text-xs font-medium uppercase text-neutral-500">
                      Impact
                    </div>
                    <div className="text-lg font-semibold text-white">
                      +40% Velocity
                    </div>
                  </div>
                  <div className="rounded-xl border border-neutral-800 bg-neutral-800/20 p-4">
                    <div className="mb-1 text-xs font-medium uppercase text-neutral-500">
                      Setup
                    </div>
                    <div className="text-lg font-semibold text-white">
                      Instant
                    </div>
                  </div>
                </div>

                {selectedFeature.cta && (
                  <div className="mt-8">
                    <button className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-blue-500">
                      {selectedFeature.cta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
