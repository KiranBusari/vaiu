import Link from "next/link";
import { PropsWithChildren } from "react";
import { getWorkspaces } from "@/features/workspaces/queries";
import { UserButton } from "@/features/auth/components/user-button";

const StandaloneLayout = async ({ children }: PropsWithChildren) => {
  const workspaces = await getWorkspaces();
  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center h-[73px]">
          <Link href={`/workspaces/${workspaces.documents[0].$id}`}>
            <h1 className="text-4xl font-medium">RepoX</h1>
          </Link>
          <UserButton />
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
};

export default StandaloneLayout;
