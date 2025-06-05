import Link from "next/link";
import { PropsWithChildren } from "react";
import { UserButton } from "@/features/auth/components/user-button";
import { Logo } from "@/components/Logo";
import { Logo2 } from "@/components/Logo2";
import { ModeToggle } from "@/components/ui/ModeToggle";

const StandaloneLayout = async ({ children }: PropsWithChildren) => {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-screen-2xl px-2 py-2 md:px-4">
        <nav className="flex h-[73px] items-center justify-between">
          <Link href="/">
            <Logo className="dark:hidden" />
            <Logo2 className="hidden dark:block" />
          </Link>
          <div className="flex items-center justify-center gap-x-4">
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
