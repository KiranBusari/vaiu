"use client";
import { LoaderPinwheelIcon } from "lucide-react";
const LoadingPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <LoaderPinwheelIcon className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};

export default LoadingPage;
