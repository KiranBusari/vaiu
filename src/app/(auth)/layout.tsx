"use client";

import { PropsWithChildren } from "react";
import { Navbar } from "@/components/mainNavbar";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="min-h-[100vh] bg-neutral-100 dark:bg-neutral-950">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
          <Navbar />
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:py-14">
          {children}
        </div>
      </div>
    </main>
  );
};
export default AuthLayout;
