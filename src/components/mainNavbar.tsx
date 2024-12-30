"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./ModeToggle";
import Link from "next/link";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Logo2 } from "./Logo2";
import { usePathname } from "next/navigation";

export function Navbar({ className }: { className?: string }) {
  const pathname = usePathname();
  const isSignIn = pathname === "/sign-in";
  return (
    <div
      className={cn(
        "wrapper sticky top-0 z-50 mx-auto flex w-full items-center py-6",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-2xl border border-primary/10 bg-secondary/15 px-6 py-3 shadow-lg shadow-neutral-600/5 backdrop-blur-lg">
        <Link href="/" className="flex items-center">
          <Logo className="dark:hidden" />
          <Logo2 className="hidden dark:block" />
        </Link>
        <div className="flex items-center gap-x-4">
          <Button
            asChild
            variant="outline"
            className="text-blue-500 border hover:text-blue-700 "
            size="default"
          >
            <Link href={isSignIn ? "/sign-up" : "/sign-in"}>
              {isSignIn ? "Sign Up" : "Login"}
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
