import { useQueryState, parseAsBoolean } from "nuqs";

export const useAddCollaboratorToProjectModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "add-collaborator-to-project",
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
