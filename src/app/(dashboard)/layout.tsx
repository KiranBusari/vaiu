import { PropsWithChildren } from "react";
import { Navbar } from "@/components/navbar";
// import { SidebarComponent } from "@/components/sidebar";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import { CreateTaskModal } from "@/features/issues/components/create-task-modal";
import { EditTaskModal } from "@/features/issues/components/edit-task-modal";
import { AddCollaboratorToProjectModal } from "@/features/projects/components/add-collaborator-to-project-modal";
import { CreateRoomModal } from "@/features/channels/components/create-channel-modal";
import { CreatePrModal } from "@/features/projects/components/create-pr-modal";
import { FileUploaderModal } from "@/features/projects/components/file-uploader-modal";

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <AddCollaboratorToProjectModal />
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreateRoomModal />
      <CreateTaskModal />
      <CreatePrModal />
      <EditTaskModal />
      <FileUploaderModal />
      <div className="flex h-full w-full">
        <div className="w-full">
          <div className="mx-auto h-screen">
            <Navbar />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
