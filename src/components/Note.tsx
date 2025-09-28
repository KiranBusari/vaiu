import { AlertTriangle } from "lucide-react";
import React from "react";

const Note = ({ content }: { content: string }) => {
  return (
    <div className="w-full rounded-sm border border-gray-500 bg-gray-600 p-2">
      <div className="flex text-slate-200">
        <AlertTriangle size={24} color="red" className="mr-1" />
        Note:&nbsp;<span className="">{content}</span>
      </div>
    </div>
  );
};

export default Note;
