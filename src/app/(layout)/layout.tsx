import { SidebarComponent } from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <SidebarComponent />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default layout;
