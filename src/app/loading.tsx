"use client";
import { LoaderPinwheelIcon } from "lucide-react";
const LoadingPage = () => {
  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <LoaderPinwheelIcon className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};

export default LoadingPage;
