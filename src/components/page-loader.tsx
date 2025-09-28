import { LoaderPinwheelIcon } from "lucide-react";

export const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoaderPinwheelIcon className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};

// "use client";
//
// import { motion } from "framer-motion";
// import { useState, useEffect } from "react";
//
// export const Loader = () => {
//   const [isLoaded, setIsLoaded] = useState(false);
//
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoaded(true);
//     }, 3000); // Adjust time as needed
//     return () => clearTimeout(timer);
//   }, []);
//
//   const letters = ["V", "A", "I", "U"];
//
//   return (
//     <motion.div
//       className="fixed inset-0 flex items-center justify-center bg-black text-white text-2xl font-bold z-50"
//       initial={{ opacity: 1 }}
//       animate={{ opacity: isLoaded ? 0 : 1, scale: isLoaded ? 1.2 : 1 }}
//       transition={{ duration: 1.5, ease: "easeInOut" }}
//       exit={{ opacity: 0 }}
//     >
//       <motion.div className="flex">
//         {letters.map((letter, index) => (
//           <motion.span
//             key={index}
//             className="text-blue-400"
//             style={{ textShadow: "0px 0px 15px #3b82f6" ,fontStyle:""}} // Neon glow effect
//             initial={{ y: 2, opacity: 0, scale: 0.1 }}
//             animate={{
//               y: 0,
//               opacity: 1,
//               scale: [1, 1.2, 1], // Looping pulse effect
//             }}
//             exit={{ y: -2, opacity: 0, scale: 0.1 }}
//             transition={{
//               duration: 0.6,
//               delay: index * 0.2,
//               ease: "easeInOut",
//               repeat: Infinity, // Looping effect
//               repeatType: "reverse",
//             }}
//           >
//             {letter}
//           </motion.span>
//         ))}
//       </motion.div>
//     </motion.div>
//   );
// };
