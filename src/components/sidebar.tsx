import Link from "next/link";

import { Projects } from "./projects";
import { Navigation } from "./navigation";
import { DottedSeparator } from "./dotted-separator";
import { WorkspaceSwitcher } from "./workspace-switcher";
import Rooms from "./Rooms";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <div className="flex items-center justify-center">
        <h1 className="text-4xl font-medium">RepoX</h1>
      </div>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <Projects />
      <DottedSeparator className="my-4" />
      <Rooms />
    </aside>
  );
};
