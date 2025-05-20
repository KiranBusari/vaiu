"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import FileUploader from "./file-uploader";
import { useFileUploadModal } from "../hooks/use-file-upload";

export const FileUploaderModal = () => {
  const { isOpen, setIsOpen, closeFileUploader } = useFileUploadModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <FileUploader onCancel={closeFileUploader} />
    </ResponsiveModal>
  );
};
