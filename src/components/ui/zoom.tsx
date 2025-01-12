"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ZoomProps {
  children: React.ReactNode;
}

export function Zoom({ children }: ZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <motion.div
      onClick={() => setIsZoomed(!isZoomed)}
      animate={{
        scale: isZoomed ? 1.5 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ cursor: "zoom-in" }}
    >
      {children}
    </motion.div>
  );
}
