import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  GitPullRequest,
  Lock,
  GitMerge,
  FileCode,
  MousePointer2,
  Mic,
  Video,
  PhoneOff,
  Users,
  MicOff,
  Terminal,
  RefreshCw,
  Github,
  Zap,
} from "lucide-react";

// --- Consistent Card Background ---
export const CardBackground = ({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`relative flex h-full w-full flex-col overflow-hidden bg-neutral-950 ${className}`}
  >
    {/* Subtle Grid Pattern */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />

    {/* Radial Gradient for depth */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_400px_at_50%_50%,#3b82f605,transparent)]" />

    {children}
  </div>
);

// --- 1. AI Code Review ---
export const CodeReviewVisual = () => {
  return (
    <CardBackground className="items-center justify-center p-6">
      <div className="relative w-full max-w-[280px] overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/90 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-900 px-3 py-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/20" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/20" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/20" />
          </div>
          <div className="ml-2 h-2 w-20 rounded-full bg-neutral-800" />
        </div>

        {/* Code Content */}
        <div className="space-y-2 p-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 text-[10px] text-neutral-600">{i}</div>
              <div
                className={`h-2 rounded-full bg-neutral-800 ${i === 3 ? "w-1/2" : "w-full"}`}
                style={{ width: `${Math.random() * 30 + 50}%` }}
              />
            </div>
          ))}

          {/* Animated Error/Fix Line */}
          <div className="flex items-center gap-2">
            <div className="w-4 text-[10px] text-neutral-600">5</div>
            <motion.div
              initial={{ backgroundColor: "#ef4444", width: "80%" }}
              animate={{ backgroundColor: "#22c55e", width: "85%" }}
              transition={{
                duration: 0.8,
                delay: 1,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
              className="h-2 rounded-full opacity-60"
            />
          </div>

          {[6, 7].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 text-[10px] text-neutral-600">{i}</div>
              <div className="h-2 w-2/3 rounded-full bg-neutral-800" />
            </div>
          ))}
        </div>

        {/* Scanner Overlay */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[20px] bg-gradient-to-b from-blue-500/10 to-transparent"
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 2, ease: "linear", repeat: Infinity }}
        />

        {/* Floating Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1, 1, 0.8],
            y: [10, 0, 0, 10],
          }}
          transition={{
            duration: 4,
            times: [0, 0.2, 0.8, 1],
            repeat: Infinity,
            delay: 1,
          }}
          className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 backdrop-blur-md"
        >
          <CheckCircle2 className="h-3 w-3 text-green-400" />
          <span className="text-[10px] font-medium text-green-400">
            Security Check Passed
          </span>
        </motion.div>
      </div>
    </CardBackground>
  );
};

// --- 2. Test Gen ---
export const TestGenVisual = () => {
  return (
    <CardBackground className="p-5">
      <div className="flex h-full flex-col gap-4 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10 text-blue-400">
              <Terminal className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-medium text-neutral-300">
              Test Runner
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            <span className="font-mono text-[10px] text-green-400">
              PASSING
            </span>
          </div>
        </div>

        {/* Test Items */}
        <div className="flex flex-col gap-2">
          {[
            { name: "auth.test.ts", duration: "124ms" },
            { name: "api_route.spec.ts", duration: "450ms" },
            { name: "utils.test.tsx", duration: "89ms" },
          ].map((test, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-md bg-neutral-800/30 px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.5 + 0.2 }}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                </motion.div>
                <span className="text-xs text-neutral-400">{test.name}</span>
              </div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.5 + 0.5 }}
                className="font-mono text-[10px] text-neutral-500"
              >
                {test.duration}
              </motion.span>
            </div>
          ))}

          {/* Simulated running test */}
          <div className="flex items-center justify-between rounded-md bg-neutral-800/30 px-3 py-2">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <div className="h-3.5 w-3.5 rounded-full border-2 border-neutral-600 border-t-blue-500" />
              </motion.div>
              <span className="text-xs text-neutral-300">
                billing_flow.test.ts
              </span>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-auto grid grid-cols-3 gap-2 border-t border-neutral-800 pt-3">
          <div className="text-center">
            <div className="text-[10px] text-neutral-500">Total</div>
            <div className="font-mono text-xs text-neutral-300">42</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-neutral-500">Passed</div>
            <div className="font-mono text-xs text-green-400">41</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-neutral-500">Coverage</div>
            <div className="font-mono text-xs text-blue-400">98%</div>
          </div>
        </div>
      </div>
    </CardBackground>
  );
};

// Internal Helper Icon
const SparklesIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM9 15a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 15z"
      clipRule="evenodd"
    />
  </svg>
);

// --- 3. Smart Summaries ---
export const SummaryVisual = () => {
  return (
    <CardBackground className="items-center justify-center p-4">
      <div className="relative flex w-full max-w-[220px] flex-col gap-2">
        {/* Abstract Text Lines */}
        <div className="space-y-2 p-2 opacity-30 blur-[1px]">
          <div className="h-2 w-full rounded-full bg-neutral-600" />
          <div className="h-2 w-[90%] rounded-full bg-neutral-600" />
          <div className="h-2 w-[95%] rounded-full bg-neutral-600" />
          <div className="h-2 w-[80%] rounded-full bg-neutral-600" />
        </div>

        {/* Magic Summary Card */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
          className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 overflow-hidden rounded-lg border border-purple-500/30 bg-neutral-900/95 shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)] backdrop-blur-md"
        >
          <div className="flex items-center gap-2 border-b border-purple-500/10 bg-purple-500/5 px-3 py-2">
            <SparklesIcon className="h-3 w-3 text-purple-400" />
            <span className="text-[10px] font-medium text-purple-300">
              AI Summary
            </span>
          </div>
          <div className="space-y-2 p-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: 1,
                delay: 0.2,
                repeat: Infinity,
                repeatDelay: 2.8,
              }}
              className="h-1.5 rounded-full bg-neutral-600"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "80%" }}
              transition={{
                duration: 1,
                delay: 0.3,
                repeat: Infinity,
                repeatDelay: 2.8,
              }}
              className="h-1.5 rounded-full bg-neutral-600"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{
                duration: 1,
                delay: 0.4,
                repeat: Infinity,
                repeatDelay: 2.8,
              }}
              className="h-1.5 rounded-full bg-neutral-600"
            />
          </div>
        </motion.div>
      </div>
    </CardBackground>
  );
};

// --- 4. Analytics Visual ---
export const AnalyticsVisual = () => {
  return (
    <CardBackground className="flex-col justify-end">
      <div className="relative h-full w-full p-6 pt-10">
        <div className="flex h-[80%] items-end justify-between gap-2">
          {[35, 60, 45, 80, 55, 90, 70].map((h, i) => (
            <div key={i} className="relative flex h-full w-full items-end">
              <motion.div
                initial={{ height: "0%" }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                className="w-full rounded-t-[2px] bg-neutral-800 transition-colors group-hover:bg-neutral-700"
              >
                {i === 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-blue-500 px-2 py-1 text-[10px] font-bold text-white shadow-lg"
                  >
                    +24%
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-blue-500" />
                  </motion.div>
                )}
                {i === 5 && (
                  <div className="h-full w-full bg-gradient-to-t from-blue-500/20 to-blue-500/80" />
                )}
              </motion.div>
            </div>
          ))}
        </div>

        {/* X-Axis Line */}
        <div className="mt-2 h-px w-full bg-neutral-800" />
      </div>
    </CardBackground>
  );
};

// --- 5. PR Management ---
export const PRVisual = () => {
  return (
    <CardBackground className="items-center justify-center p-4">
      <div className="relative flex h-full w-full items-center justify-center">
        {/* Git Graph Visualization */}
        <svg viewBox="0 0 200 120" className="h-full w-full">
          {/* Main Branch Line */}
          <line
            x1="20"
            y1="60"
            x2="180"
            y2="60"
            stroke="#262626"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Feature Branch Path */}
          <motion.path
            d="M 40 60 C 60 60, 60 20, 80 20 L 120 20 C 140 20, 140 60, 160 60"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Commits */}
          <circle cx="40" cy="60" r="4" fill="#52525b" />
          <circle cx="160" cy="60" r="4" fill="#52525b" />

          {/* Moving Commit on Feature Branch */}
          <motion.circle
            cx="0"
            cy="0"
            r="5"
            fill="#3b82f6"
            stroke="#000"
            strokeWidth="2"
          >
            <animateMotion
              path="M 40 60 C 60 60, 60 20, 80 20 L 120 20 C 140 20, 140 60, 160 60"
              dur="2s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.2 1"
            />
          </motion.circle>

          {/* Merge Icon at the end */}
          <foreignObject x="150" y="40" width="20" height="20">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 1.8,
                duration: 0.4,
                repeat: Infinity,
                repeatDelay: 1.6,
              }}
            >
              <GitMerge className="h-5 w-5 text-purple-500" />
            </motion.div>
          </foreignObject>
        </svg>

        <div className="absolute bottom-4 left-4 flex gap-2">
          <div className="flex items-center gap-1.5 rounded-md border border-neutral-800 bg-neutral-900/80 px-2 py-1">
            <GitPullRequest className="h-3 w-3 text-neutral-400" />
            <span className="text-[10px] text-neutral-400">#420 Open</span>
          </div>
        </div>
      </div>
    </CardBackground>
  );
};

// --- 6. Kanban Visual ---
export const KanbanVisual = () => {
  return (
    <CardBackground className="p-5">
      <div className="flex h-full w-full gap-3">
        {/* Columns */}
        {[0, 1, 2].map((col) => (
          <div
            key={col}
            className="flex flex-1 flex-col gap-2 rounded-lg border border-neutral-800 bg-neutral-900/50 p-2"
          >
            {/* Column Header */}
            <div className="mb-1 flex items-center gap-2">
              <div
                className={`h-1.5 w-1.5 rounded-full ${col === 0 ? "bg-neutral-500" : col === 1 ? "bg-blue-500" : "bg-green-500"}`}
              />
              <div className="h-1.5 w-12 rounded-full bg-neutral-800" />
            </div>

            {/* Static Card */}
            {col !== 1 && (
              <div className="h-10 w-full rounded border border-neutral-800 bg-neutral-800/50" />
            )}

            {/* Moving Card */}
            {col === 0 && (
              <motion.div
                layoutId="kanban-card"
                className="h-10 w-full rounded border border-neutral-700 bg-neutral-800"
                animate={{ x: "110%", opacity: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 1,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
            )}
            {col === 1 && (
              <motion.div
                className="h-10 w-full rounded border border-blue-500/40 bg-blue-500/10 shadow-lg shadow-blue-500/10"
                initial={{ x: "-110%", opacity: 0 }}
                animate={{ x: "0%", opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 1,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                <div className="flex h-full w-full items-center gap-2 px-2">
                  <div className="h-1.5 w-8 rounded-full bg-blue-500/40" />
                </div>
              </motion.div>
            )}
            {col === 2 && (
              <div className="h-8 w-full rounded border border-neutral-800 bg-neutral-800/30" />
            )}
          </div>
        ))}
      </div>
    </CardBackground>
  );
};

// --- 7. Issues Visual (Renamed conceptually to SyncVisual) ---
export const IssuesVisual = () => {
  return (
    <CardBackground className="items-center justify-center p-4">
      <div className="flex w-full items-center justify-between gap-3 px-2">
        {/* Left: GitHub */}
        <div className="relative z-10 flex-1 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-xl">
          <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-900/50 px-3 py-2">
            <Github className="h-3.5 w-3.5 text-neutral-300" />
            <span className="text-[10px] font-medium text-neutral-400">
              GitHub
            </span>
          </div>
          <div className="space-y-2 p-3">
            <div className="flex items-center gap-2 rounded bg-neutral-800/30 p-1.5">
              <div className="h-2 w-2 rounded-full border border-neutral-600" />
              <div className="h-1.5 w-12 rounded-full bg-neutral-700" />
            </div>
            <motion.div
              animate={{
                backgroundColor: [
                  "rgba(38,38,38,0.3)",
                  "rgba(168,85,247,0.2)",
                  "rgba(38,38,38,0.3)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, times: [0, 0.2, 1] }}
              className="flex items-center gap-2 rounded bg-neutral-800/30 p-1.5"
            >
              <div className="h-2 w-2 rounded-full border border-purple-500" />
              <div className="h-1.5 w-16 rounded-full bg-neutral-700" />
              <div className="ml-auto h-1 w-4 rounded-full bg-purple-500/50" />
            </motion.div>
            <div className="flex items-center gap-2 rounded bg-neutral-800/30 p-1.5">
              <div className="h-2 w-2 rounded-full border border-neutral-600" />
              <div className="h-1.5 w-10 rounded-full bg-neutral-700" />
            </div>
          </div>
        </div>

        {/* Center: Sync Logic */}
        <div className="relative flex flex-col items-center gap-2 text-neutral-600">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="h-4 w-4 text-blue-500" />
          </motion.div>

          {/* Particle L -> R */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
            animate={{
              x: [-30, 30],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Particle R -> L */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
            animate={{
              x: [30, -30],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.75,
            }}
          />
        </div>

        {/* Right: Vaiu */}
        <div className="relative z-10 flex-1 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-xl">
          <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-900/50 px-3 py-2">
            <Zap className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-[10px] font-medium text-neutral-400">
              Vaiu
            </span>
          </div>
          <div className="space-y-2 p-3">
            <div className="flex items-center gap-2 rounded bg-neutral-800/30 p-1.5">
              <div className="h-2 w-2 rounded-sm bg-neutral-700" />
              <div className="h-1.5 w-12 rounded-full bg-neutral-700" />
            </div>
            <motion.div
              animate={{
                backgroundColor: [
                  "rgba(38,38,38,0.3)",
                  "rgba(59,130,246,0.2)",
                  "rgba(38,38,38,0.3)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                times: [0, 0.2, 1],
                delay: 0.75,
              }}
              className="flex items-center gap-2 rounded bg-neutral-800/30 p-1.5"
            >
              <div className="h-2 w-2 rounded-sm bg-blue-500/20" />
              <div className="h-1.5 w-16 rounded-full bg-neutral-700" />
              <div className="ml-auto h-1 w-4 rounded-full bg-blue-500/50" />
            </motion.div>
            <div className="flex items-center gap-2 rounded bg-neutral-800/30 p-1.5">
              <div className="h-2 w-2 rounded-sm bg-neutral-700" />
              <div className="h-1.5 w-10 rounded-full bg-neutral-700" />
            </div>
          </div>
        </div>
      </div>
    </CardBackground>
  );
};

// --- 8. Repo Visual ---
export const RepoVisual = () => {
  return (
    <CardBackground className="p-5">
      <div className="flex flex-col gap-2 font-mono text-[10px] text-neutral-400">
        <div className="flex items-center gap-2 text-neutral-300">
          <Lock className="h-3 w-3" />
          <span>vaiu-core</span>
        </div>

        <div className="ml-1.5 flex flex-col gap-2 border-l border-neutral-800 pl-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-neutral-600" />
            <span>src</span>
          </div>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="ml-1.5 flex flex-col gap-2 overflow-hidden border-l border-neutral-800 pl-3"
          >
            <div className="flex items-center gap-2 text-blue-400">
              <FileCode className="h-3 w-3" />
              <span>config.ts</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCode className="h-3 w-3" />
              <span>types.d.ts</span>
            </div>
          </motion.div>
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-neutral-600" />
            <span>tests</span>
          </div>
        </div>
      </div>

      {/* Settings Gear Overlay */}
      <motion.div
        animate={{ rotate: 180 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-4 -right-4 opacity-10"
      >
        <div className="h-24 w-24 rounded-full border-4 border-dashed border-white" />
      </motion.div>
    </CardBackground>
  );
};

// --- 9. Real-time Collab (Video Call Visual with Screen Share) ---
export const CollabVisual = () => {
  return (
    <CardBackground className="p-4">
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
        {/* Header / Top Bar */}
        <div className="absolute left-0 top-0 z-20 flex w-full items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            <span className="text-[10px] font-medium text-neutral-400">
              Live • 24:12
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-neutral-800/80 px-2 py-0.5 backdrop-blur-sm">
            <Users className="h-3 w-3 text-neutral-400" />
            <span className="text-[10px] text-neutral-400">Team</span>
          </div>
        </div>

        {/* Main Area: Screen Share */}
        <div className="relative flex-1 bg-neutral-950/50 p-2">
          <div className="relative h-full w-full overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
            {/* Screen Content Simulation (Code Editor) */}
            <div className="flex items-center gap-1.5 border-b border-neutral-800 bg-neutral-900 px-2 py-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500/20" />
              <div className="h-1.5 w-1.5 rounded-full bg-yellow-500/20" />
              <div className="h-1.5 w-1.5 rounded-full bg-green-500/20" />
              <div className="ml-2 h-1 w-12 rounded-full bg-neutral-800" />
            </div>
            <div className="space-y-1.5 p-3 opacity-60">
              <div className="flex gap-2">
                <div className="h-1.5 w-8 rounded bg-purple-500/20" />
                <div className="h-1.5 w-16 rounded bg-blue-500/20" />
              </div>
              <div className="ml-4 h-1.5 w-24 rounded bg-neutral-700" />
              <div className="ml-4 h-1.5 w-20 rounded bg-neutral-700" />
              <div className="ml-4 flex gap-2">
                <div className="h-1.5 w-12 rounded bg-neutral-700" />
                <div className="h-1.5 w-8 rounded bg-yellow-500/20" />
              </div>
              <div className="h-1.5 w-10 rounded bg-neutral-700" />
            </div>

            {/* Live Cursor moving */}
            <motion.div
              className="absolute"
              animate={{
                top: ["40%", "60%", "30%", "40%"],
                left: ["30%", "60%", "70%", "30%"],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <MousePointer2 className="h-3 w-3 fill-blue-500 stroke-white stroke-[1px] text-transparent" />
              <div className="-mt-1 ml-2 rounded bg-blue-500 px-1 py-0.5 text-[6px] font-bold text-white">
                Alex
              </div>
            </motion.div>

            {/* Presenting Badge */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5">
              <div className="h-1 w-1 animate-pulse rounded-full bg-blue-500" />
              <span className="text-[8px] font-medium text-blue-400">
                Alex is presenting
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Area: Participants Row */}
        <div className="relative z-10 flex h-16 shrink-0 items-center gap-2 border-t border-neutral-800 bg-neutral-900 px-3 py-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative aspect-video h-full flex-1 overflow-hidden rounded border border-neutral-800 bg-neutral-800"
            >
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-700">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-600 text-[8px] font-bold text-neutral-300 ring-2 ring-neutral-800">
                  {["JD", "AL", "MK"][i - 1]}
                </div>
              </div>

              {/* Status Indicators (Mute/Speaking) */}
              <div className="absolute bottom-1 right-1 flex gap-1">
                {i === 1 && (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500/80 backdrop-blur-sm">
                    <MicOff className="h-2 w-2 text-white" />
                  </div>
                )}
                {i === 2 && (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500/80 backdrop-blur-sm">
                    <Mic className="h-2 w-2 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Floating Controls */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/90 px-3 py-1.5 shadow-xl backdrop-blur-md">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700">
            <Mic className="h-3 w-3 text-neutral-400" />
          </div>
          {/* Screen Share Active State */}
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <Video className="h-3 w-3" />
          </div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500/20">
            <PhoneOff className="h-3 w-3 text-red-500" />
          </div>
        </div>
      </div>
    </CardBackground>
  );
};
