import Link from "next/link";
import { PropsWithChildren } from "react";
import { UserButton } from "@/features/auth/components/user-button";
import { Logo } from "@/components/Logo";
import { Logo2 } from "@/components/Logo2";
import { ModeToggle } from "@/components/ui/ModeToggle";

const StandaloneLayout = async ({ children }: PropsWithChildren) => {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center h-[73px]">
          <Link href="/">
            <Logo className="dark:hidden" />
            <Logo2 className="hidden dark:block" />
          </Link>
          <div className="flex items-center gap-x-4 justify-center">
            <UserButton />
            <ModeToggle />
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
};

export default StandaloneLayout;
