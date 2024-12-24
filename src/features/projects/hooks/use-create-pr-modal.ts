import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreatePrModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-pr",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const openPr = () => setIsOpen(true);
  const closePr = () => setIsOpen(false);
  return {
    isOpen,
    openPr,
    closePr,
    setIsOpen,
  };
};
