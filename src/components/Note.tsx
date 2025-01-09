import { AlertTriangle } from "lucide-react";
import React from "react";

const Note = ({ content }: { content: string }) => {
  return (
    <div className="bg-gray-600 border w-full p-2 rounded-sm border-gray-500">
      <div className="flex text-slate-200">
        <AlertTriangle size={24} color="red" className="mr-1" />
        Note:&nbsp;<span className="">{content}</span>
      </div>
    </div>
  );
};

export default Note;
