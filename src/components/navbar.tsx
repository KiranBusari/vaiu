"use client";
import { usePathname } from "next/navigation";

import { UserButton } from "@/features/auth/components/user-button";

// import { MobileSidebar } from "./mobile-sidebar";
import { ModeToggle } from "./ui/ModeToggle";
import { SidebarComponent } from "./Sidebar";

// import { NotificationBell } from "@/features/notifications/components/notification-bell";

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
    <nav className="flex items-center justify-between p-4">
      <div className="flex items-center gap-x-4">
        <div className="hidden flex-col lg:flex">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      <SidebarComponent />
      <div className="flex items-center justify-center gap-x-4">
        {/* <NotificationBell /> */}
        <UserButton />
        <ModeToggle />
      </div>
    </nav>
  );
};
