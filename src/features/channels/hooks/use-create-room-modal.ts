import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateRoomModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-room",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return {
    isOpen,
    open,
    close,
    setIsOpen,
  };
};
