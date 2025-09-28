import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
export const Logo = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(`h-200 flex w-20 items-center justify-center`, className)}
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
