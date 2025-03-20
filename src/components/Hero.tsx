"use client";

import React from "react";
import { Spotlight } from "./ui/spotlight";
import Link from "next/link";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="relative mx-auto h-auto">
      <div className="mx-auto flex min-h-[74vh] max-w-7xl items-center justify-center px-4 sm:min-h-[75vh] sm:px-6 lg:px-8">
        <Spotlight className="left-0 top-16 sm:-top-40 md:left-60 md:top-10" />
        <div className="mx-auto flex flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="relative text-[40px] font-semibold leading-[160%] tracking-[-3px] text-[#2b2b2b] dark:text-[#d3d3d3] sm:text-5xl md:text-7xl">
              Transform your learning with <br />
              <span className="bg-gradient-to-b from-[#75c1ff] to-[#0172cf] bg-clip-text text-center text-[54px] font-semibold tracking-[-4px] text-transparent sm:text-7xl md:text-9xl">
                Contributions
              </span>
            </h1>
            <p className="text-sm text-[#2b2b2b]/80 dark:text-[#d3d3d3]/80 sm:text-lg">
              A platform where you can contribute to{" "}
              <br className="block md:hidden" />
              real-world projects in a closed environment.
            </p>
          </div>
          <div className="mt-8">
            <Link href={"/sign-in"}>
              <Button className="rounded-full px-8 py-6 text-base font-bold text-[#ffffff]/90 hover:text-[#75c1ff] dark:text-[#75c1ff]">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
