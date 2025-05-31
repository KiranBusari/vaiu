"use client";
import { useRouter } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";

export const WorkspaceSwitcher = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { open } = useCreateWorkspaceModal();
  const { data: wokspaces } = useGetWorkspaces();

  const onSelect = (id: string) => {
    router.push(`/workspaces/${id}`);
  };
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          Workspaces
        </p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 cursor-pointer text-gray-500 transition hover:opacity-75 dark:text-gray-400"
        />
      </div>
      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className="w-full bg-slate-100 p-1 font-medium dark:bg-slate-800">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent className="">
          {wokspaces?.documents.map((workspace) => (
            <SelectItem value={workspace.$id} key={workspace.$id}>
              <div className="flex items-center justify-start gap-3 font-medium">
                <WorkspaceAvatar
                  name={workspace.name}
                  image={workspace.imageUrl}
                />
                <span className="truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
