"use client";
import { ResponsiveModal } from "@/components/responsive-modal";
import { CreatePrForm } from "./create-pr-form";
import { useCreatePrModal } from "../hooks/use-create-pr-modal";

export const CreatePrModal = () => {
    const { isOpen, setIsOpen, close } = useCreatePrModal();
    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreatePrForm onCancel={close} />
        </ResponsiveModal>
    );
};
