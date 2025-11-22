import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
export const Logo = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        `flex w-full items-center justify-start object-cover`,
        className,
      )}
    >
      <Image
        src={"/logo.png"}
        alt="logo"
        width={60}
        height={60}
        quality={100}
      />
    </div>
  );
};
