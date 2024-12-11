import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { SocketProvider } from "@/components/socket-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RepoX",
  description:
    "Plan, track, and manage your agile and software development projects in Jira. Customize your workflow, collaborate, and release great software",
  icons: {
    icon: "/favicon.png",
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
            <SocketProvider>
              <QueryProvider>
                <Toaster richColors theme="light" />
                {children}
              </QueryProvider>
            </SocketProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
