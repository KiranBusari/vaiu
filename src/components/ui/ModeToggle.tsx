"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      variant="outline"
      size="icon"
      className="relative"
    >
      <Sun className="absolute h-[1.2rem] w-[1.2rem] scale-0 transition-all dark:scale-100 dark:text-slate-300" />
      <Moon className="absoluteh-[1.2rem] w-[1.2rem] rotate-0 scale-100 text-slate-500 transition-all dark:-rotate-90 dark:scale-0" />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
}
