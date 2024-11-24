import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { LampContainer } from "./ui/lamp";

const Hero = () => {
  return (
    <LampContainer className="flex h-screen max-w-full place-content-center">
      <div className="text-center">
        <h1 className="bg-gradient-to-b flex-col flex from-slate-50 to-slate-500 bg-clip-text text-8xl font-bold leading-[150%] text-transparent">
          Contributions
          <span className="bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-8xl font-semibold text-transparent p-4">
            Transform your Learning
          </span>
        </h1>
        <p className="text-lg text-slate-300 py-4">
          A platform where you can contribute to real-world projects in a closed
          environment.
        </p>
      </div>
      <div className="mt-10">
        <Button
          className="text-blue-400 hover:text-blue-500 font-bold rounded-full"
          variant={"outline"}
          size={"lg"}
        >
          <Link href={"/sign-in"}>Get Started</Link>
        </Button>
      </div>
    </LampContainer>
  );
};

export default Hero;
