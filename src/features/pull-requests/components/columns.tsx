"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

import { snakeCaseToTitleCase } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PullRequest } from "../types";
import { MemberAvatar } from "@/features/members/components/members-avatar";

export const columns: ColumnDef<PullRequest>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const title = row.original.title;
      const url = row.original.url;
      const number = row.original.number;
      return (
        <Link href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
          <p className="line-clamp-1">#{number} {title}</p>
        </Link>
      );
    },
  },
  {
    accessorKey: "author",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Author
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const author = row.original.author;
      return (
        <div className="flex items-center gap-x-2 font-medium">
          <MemberAvatar
            fallbackClassName="text-xs"
            className="size-6"
            name={author}
          />
          <p className="line-clamp-1">{author}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assignee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const assignee = row.original.assignee;
      if (!assignee) {
        return <p className="text-muted-foreground">No assignee</p>;
      }
      return (
        <div className="flex items-center gap-x-2 font-medium">
          <MemberAvatar
            fallbackClassName="text-xs"
            className="size-6"
            name={assignee}
          />
          <p className="line-clamp-1">{assignee}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return <Badge variant={status}>{snakeCaseToTitleCase(status)}</Badge>;
    },
  },
];
