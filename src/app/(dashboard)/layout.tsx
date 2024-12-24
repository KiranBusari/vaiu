import { PropsWithChildren } from "react";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import { CreateTaskModal } from "@/features/tasks/components/create-task-modal";
import { EditTaskModal } from "@/features/tasks/components/edit-task-modal";
import { AddCollaboratorToProjectModal } from "@/features/projects/components/add-collaborator-to-project-modal";
import { CreateRoomModal } from "@/features/channels/components/create-channel-modal";
import { CreatePrModal } from "@/features/projects/components/create-pr-modal";

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen dark:bg-gray-950 bg-gray-100">
      <AddCollaboratorToProjectModal />
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreateRoomModal />
      <CreateTaskModal />
      <CreatePrModal />
      <EditTaskModal />
      <div className="flex h-full w-full">
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px] w-full">
          <div className="mx-auto max-w-screen-2xl h-full">
            <Navbar />
            <main className="h-full py-8 px-6 flex flex-col">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
