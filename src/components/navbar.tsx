"use client";
import { usePathname } from "next/navigation";

import { UserButton } from "@/features/auth/components/user-button";

import { MobileSidebar } from "./mobile-sidebar";
import { ModeToggle } from "./ModeToggle";

const pathnameMap = {
  tasks: {
    title: "Issues",
    description: "View all of your issues here",
  },
  projects: {
    title: "My Projects",
    description: "View issues of your project here",
  },
};
const defaultMap = {
  title: "Hey there!",
  description: "Track all your projects and issues here",
};
export const Navbar = () => {
  const pathname = usePathname();
  const parts = pathname.split("/");
  const pathnameKey = parts[3] as keyof typeof pathnameMap;

  const { description, title } = pathnameMap[pathnameKey] || defaultMap;
  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <MobileSidebar />
      <div className="flex items-center justify-center gap-x-4">
        <UserButton />
        <ModeToggle />
      </div>
    </nav>
  );
};
