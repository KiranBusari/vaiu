import React from "react";
import { Spotlight } from "./ui/spotlight";
import { Button } from "./ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:top-10"
        fill="dark:white blue"
      />
      <div className="text-center leading-8">
        <h1 className="bg-gradient-to-b from-blue-400 to-blue-600 bg-clip-text text-7xl font-bold leading-[150%] tracking-tight text-transparent">
          Transform your Learning with <br />
          <span className="bg-gradient-to-b from-slate-100 to-slate-200 bg-clip-text text-9xl font-semibold text-transparent">
            {" "}
            Contributions
          </span>
        </h1>
        <p className="text-lg text-gray-500">
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
    </div>
  );
};

export default Hero;
