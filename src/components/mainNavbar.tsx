"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./ModeToggle";
import Link from "next/link";
import { Logo } from "./Logo";
import { Button } from "./ui/button";

export function Navbar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "wrapper sticky top-0 z-50 mx-auto flex w-full items-center py-6",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-2xl border border-primary/10 bg-secondary/15 px-6 py-3 shadow-lg shadow-neutral-600/5 backdrop-blur-lg">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>
        <div className="flex items-center">
          <Link href="/sign-up" className="mr-4">
            <Button variant={"secondary"}>Sign Up</Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
