import { PropsWithChildren } from "react";
import { useMedia } from "react-use";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Drawer, DrawerContent, DrawerOverlay } from "./ui/drawer";

export const ResponsiveModal = ({
  open,
  children,
  onOpenChange,
  title = "Modal",
}: PropsWithChildren<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
}>) => {
  const isDesktop = useMedia("(min-width: 1024px)", true);
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogOverlay className="bg-background/5 backdrop-blur-sm" />
        <DialogContent className="hide-scrollbar max-h-[85vh] w-full overflow-y-auto border-none p-0 sm:max-w-lg">
          <DialogTitle hidden>{title}</DialogTitle>
          <DialogDescription hidden>Modal dialog content</DialogDescription>
          {children}
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerOverlay className="bg-background/5 backdrop-blur-sm" />
      <DrawerContent>
        <div className="hide-scrollbar max-h-[85vh] overflow-y-auto">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
