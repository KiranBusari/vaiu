"use client";
import { ResponsiveModal } from "@/components/responsive-modal";
import { useCreateRoomModal } from "../hooks/use-create-room-modal";
import CreateChannelForm from "./create-channel-form";

export const CreateRoomModal = () => {
  const { isOpen, setIsOpen, close } = useCreateRoomModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateChannelForm onCancel={close} />
    </ResponsiveModal>
  );
};
