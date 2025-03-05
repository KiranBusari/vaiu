import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Logo2 } from "@/components/Logo2";
import { Logo } from "@/components/Logo";

import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vaiu",
  description:
    "Plan, track, and manage your agile and software development projects in vaiu. Customize your workflow, collaborate, and release great software",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <QueryProvider>
              <Toaster richColors theme="dark" />
              <Analytics />
              {children}
              <footer className="w-full border-t border-slate-800 bg-background py-6 md:py-12">
                <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6 mx-auto">
                  <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center">
                      <Logo className="dark:hidden" />
                      <Logo2 className="hidden dark:block" />
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-4 sm:gap-6">
                    <Link href="#" className="text-sm text-gray-600 dark:text-slate-400">
                      Terms
                    </Link>
                    <Link href="#" className="text-sm text-gray-600 dark:text-slate-400">
                      Privacy
                    </Link>
                    <Link href="#" className="text-sm text-gray-600 dark:text-slate-400">
                      Contact
                    </Link>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">© {new Date().getFullYear()} Vaiu. All rights reserved.</div>
                </div>
              </footer>
            </QueryProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
