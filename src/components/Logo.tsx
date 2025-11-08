import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
export const Logo = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        `flex w-full items-center justify-center object-cover`,
        className,
      )}
    >
      <Image
        src={"/logo.png"}
        alt="logo"
        width={100}
        height={100}
        quality={100}
      />
    </div>
  );
};
