"use client";

import { useState } from "react";
import { MoreHorizontal, Bot, ExternalLink, Loader2 } from "lucide-react";
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
    reset,
  } = useGenerateAIReview();

  const handleAIReview = async () => {
    try {
      reset(); // Clear any previous data/errors
      setShowAIReview(true);
      await generateReview({
        projectId,
        prNumber: pr.number,
      });
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
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>AI Review Results</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-4">Analyzing...</span>
            </div>
          ) : reviewData?.review ? (
            <div>
              <AIReviewResults
                review={reviewData.review}
                onClose={handleCloseReview}
              />
            </div>
          ) : (
            <div className="p-8 text-center">
              <p>No review data available.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}