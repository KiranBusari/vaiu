import { LoaderPinwheelIcon } from "lucide-react";

export const PageLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoaderPinwheelIcon className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};
