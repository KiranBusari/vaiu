"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TaskCommentsProps {
  issueId: string;
}

import { IMAGES_BUCKET_ID } from "@/config";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useGetIssueComments } from "../api/use-get-comments";
import { useCreateIssueComment } from "../api/use-create-issue-comments";

export const TaskComments = ({ issueId }: TaskCommentsProps) => {
  const { data: comments, isLoading } = useGetIssueComments({issueId});
  const { mutate: createComment, isPending } = useCreateIssueComment(issueId);
  const [text, setText] = React.useState("");
  const [attachment, setAttachment] = React.useState<File | undefined>();
  const [preview, setPreview] = React.useState<string | undefined>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (text.trim() || attachment) {
      createComment({ 
        json: { text, attachment },
        param: { issueId }
      });
      setText("");
      setAttachment(undefined);
      setPreview(undefined);
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
          <Input type="file" onChange={handleFileChange} />
          {preview && (
            <div className="mt-2">
              <Image src={preview} alt="Attachment preview" width={100} height={100} />
            </div>
          )}
          <Button size="sm" className="self-end" onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Commenting..." : "Comment"}
          </Button>
        </div>
        {/* Comment list */}
        <div className="mt-4 space-y-4">
          {isLoading && <p>Loading comments...</p>}
          {comments?.documents?.map((comment: any) => (
            <div key={comment.$id} className="flex items-start gap-x-4">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-muted" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">User name</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.$createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="mt-1 text-sm">{comment.text}</p>
                {comment.attachment && (
                  <div className="mt-2">
                    <Image src={`/api/v1/storage/buckets/${IMAGES_BUCKET_ID}/files/${comment.attachment}/view`} alt="Attachment" width={100} height={100} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
