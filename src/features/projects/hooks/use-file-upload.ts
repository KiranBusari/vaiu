import { useQueryState, parseAsBoolean } from "nuqs";

export const useFileUploadModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "file-uploader",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
  );

  const openFileUploader = () => setIsOpen(true);
  const closeFileUploader = () => setIsOpen(false);
  return {
    isOpen,
    openFileUploader,
    closeFileUploader,
    setIsOpen,
  };
};
