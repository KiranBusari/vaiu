import Link from "next/link";
import React from "react";
import { Logo } from "@/components/Logo";
import { Logo2 } from "@/components/Logo2";

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-800 bg-background py-1 md:py-2">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
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
        <div className="text-sm text-gray-600 dark:text-slate-400">
          © {new Date().getFullYear()} Vaiu. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
