"use client";

import { useState } from "react";
import { MoreHorizontal, Bot, ExternalLink, GitPullRequest, Loader2 } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { PullRequest } from "../types";
import { useGenerateAIReview } from "../api/use-ai-review";
import { AIReviewResults } from "./ai-review-results";
import { useProjectId } from "@/features/projects/hooks/use-projectId";

interface PRActionsCellProps {
  pr: PullRequest;
}

export function PRActionsCell({ pr }: PRActionsCellProps) {
  const [showAIReview, setShowAIReview] = useState(false);
  const projectId = useProjectId();
  
  const {
    generateReview,
    isLoading,
    data: reviewData,
    error,
    reset,
  } = useGenerateAIReview();

  const handleAIReview = async () => {
    try {
      reset(); // Clear any previous data/errors
      const result = await generateReview({
        projectId,
        prNumber: pr.number,
      });
      
      if (result?.review) {
        setShowAIReview(true);
      }
    } catch (error) {
      console.error("Failed to generate AI review:", error);
    }
  };

  const handleCloseReview = () => {
    setShowAIReview(false);
    reset(); // Clear the review data when closing
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link
              href={pr.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View on GitHub
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={handleAIReview}
            disabled={isLoading}
            className="flex items-center"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Bot className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Analyzing..." : "AI Review"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* AI Review Dialog */}
      <Dialog open={showAIReview} onOpenChange={setShowAIReview}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>AI Review Results</DialogTitle>
          </DialogHeader>
          {reviewData?.review && (
            <div className="overflow-auto">
              <AIReviewResults
                review={reviewData.review}
                onClose={handleCloseReview}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}