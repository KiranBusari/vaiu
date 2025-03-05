"use client";

import React from "react";
import { Spotlight } from "./ui/spotlight";
import Link from "next/link";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="relative mx-auto min-h-screen">
      <div className="mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <Spotlight
          className="left-0 top-44 sm:-top-40 md:left-60 md:top-10"
          fill="blue"
        />
        <div className="text-center leading-8">
          <h1 className="relative bg-gradient-to-b from-neutral-400 to-neutral-800 bg-clip-text text-[40px] font-bold leading-[150%] tracking-wide text-transparent dark:from-neutral-200 dark:to-neutral-500 sm:text-5xl md:text-7xl">
            Transform your learning with <br />
            <span className="bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-center text-[54px] font-semibold tracking-wide text-transparent sm:text-7xl md:text-9xl">
              Contributions
            </span>
          </h1>
          <p className="text-sm text-gray-400 sm:text-lg">
            A platform where you can contribute to{" "}
            <br className="block md:hidden" /> real-world projects in a closed
            environment.
          </p>
        </div>
        <div className="mt-10">
          <Link href={"/sign-in"}>
            <Button
              className="rounded-full font-bold text-slate-900 outline outline-blue-600 hover:text-slate-800 dark:text-slate-100 dark:hover:text-slate-200"
              variant={"outline"}
              size={"lg"}
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
