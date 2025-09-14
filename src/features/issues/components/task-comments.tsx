"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TaskCommentsProps {
  issueId: string;
}

import { useGetIssueComments } from "../api/use-get-comments";
import { useCreateIssueComment } from "../api/use-create-issue-comments";

import { formatDistanceToNow } from "date-fns";
import { MemberAvatar } from "@/features/members/components/members-avatar";

export const TaskComments = ({ issueId }: TaskCommentsProps) => {
  const { data: comments, isLoading } = useGetIssueComments({issueId});
  const { mutate: createComment, isPending } = useCreateIssueComment(issueId);
  const [text, setText] = React.useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      createComment({ 
        json: { text },
        param: { issueId }
      });
      setText("");
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Comments</h3>
      <div className="mt-4">
        {/* Comment form */}
        <div className="flex flex-col gap-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button size="sm" className="self-end" onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Commenting..." : "Comment"}
          </Button>
        </div>
        {/* Comment list */}
        <div className="mt-4 space-y-4">
          {isLoading && <p>Loading comments...</p>}
          {comments?.documents?.map((comment) => (
            <div key={comment.$id} className="flex items-start gap-x-4 rounded-md bg-muted p-4">
              <MemberAvatar name={comment.username || "?"} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{comment.username || "Unknown User"}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.$createdAt), { addSuffix: true })}
                  </p>
                </div>
                <p className="mt-1 text-sm">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
