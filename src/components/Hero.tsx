import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { LampContainer } from "./ui/lamp";

const Hero = () => {
  return (
    <LampContainer className="max-h-screen flex place-content-center text-center">
      <h1 className="bg-gradient-to-b flex-col flex from-slate-50 to-slate-800 bg-clip-text sm:text-8xl text-6xl font-bold leading-[150%] text-transparent">
        Contributions
        <span className="bg-gradient-to-b from-blue-500 to-blue-900 bg-clip-text sm:text-8xl text-3xl font-semibold text-transparent p-4">
          Transform your Learning
        </span>
      </h1>
      <p className="text-lg text-slate-300 py-4">
        A platform where you can contribute to real-world projects in a closed
        environment.
      </p>
      <div className="mt-10">
        <Link href={"/sign-in"}>
          <Button
            className="text-blue-400 hover:text-blue-500 font-bold rounded-full"
            variant={"outline"}
            size={"lg"}
          >
            Get Started
          </Button>
        </Link>
      </div>
    </LampContainer>
  );
};

export default Hero;
