import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
export const Logo2 = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(`flex h-200 w-20 items-center justify-center`, className)}
    >
      <Image
        src={"/logo2.png"}
        alt="logo"
        width={100}
        height={100}
        quality={100}
      />
    </div>
  );
};
