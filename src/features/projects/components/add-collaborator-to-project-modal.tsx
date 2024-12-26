"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useAddCollaboratorToProjectModal } from "../hooks/use-add-collaborator-to-project-modal";
import { AddCollaboratorToProjectForm } from "./add-collaborator-to-project-form";

export const AddCollaboratorToProjectModal = () => {
  const { isOpen, setIsOpen, close } = useAddCollaboratorToProjectModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <AddCollaboratorToProjectForm onCancel={close} />
    </ResponsiveModal>
  );
};
