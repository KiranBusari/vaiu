import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreatePrModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-pr",
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
