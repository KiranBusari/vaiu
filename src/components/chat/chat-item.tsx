"use client";

import * as z from "zod";
import qs from "query-string";
import { UserAvatar } from "@/components/chat/user-avatar";
import { FileIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { MemberAvatar } from "@/features/members/components/members-avatar";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

interface ChatItemProps {
  id: string;
  content: string;
  memberId: string;
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMemberId: string;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatItem: React.FC<ChatItemProps> = ({
  id,
  content,
  memberId,
  timestamp,
  fileUrl,
  deleted,
  currentMemberId,
}) => {
  const params = useParams();
  const router = useRouter();

  const workspaceId = useWorkspaceId()

  const { data: members } = useGetMembers({
    workspaceId,
  });

  const member = members?.documents.find((m) => m.$id === memberId);

  const onMemberClick = () => {
    if (currentMemberId === memberId || !member) return;
    // router.push(`/workspaces/${workspaceId}/conversations/${member.$id}`);
    router.push(`/`)
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content,
    },
  });

  useEffect(() => {
    form.reset({
      content,
    });
  }, [content]);

  const fileType = fileUrl?.split(".").pop();

  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        {member && (
          <div
            onClick={onMemberClick}
            className="cursor-pointer hover:drop-shadow-md transition"
          >
            <MemberAvatar name={member.name} />
          </div>
        )}
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            {member && (
              <div className="flex items-center">
                <p
                  onClick={onMemberClick}
                  className="font-semibold text-sm hover:underline cursor-pointer"
                >
                  {member.name}
                </p>
              </div>
            )}
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 text-sm ml-2 dark:text-indigo-300 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
