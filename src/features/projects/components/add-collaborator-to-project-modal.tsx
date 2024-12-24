"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useAddCollaboratorToProjectModal } from "../hooks/use-add-collaborator-to-project-modal";
import { AddCollaboratorToProjectWrapper } from "./add-collaborator-to-project-wrapper";

export const AddCollaboratorToProjectModal = () => {
  const { isOpen, setIsOpen, close } = useAddCollaboratorToProjectModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <AddCollaboratorToProjectWrapper onCancel={close} />
    </ResponsiveModal>
  );
};
