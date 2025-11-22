import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
export const Logo2 = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(`h-200 flex w-20 items-center justify-center`, className)}
    >
      <Image
        src={"/logo2.png"}
        alt="logo"
        width={60}
        height={60}
        quality={100}
      />
    </div>
  );
};
