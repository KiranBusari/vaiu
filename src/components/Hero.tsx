"use client";

import React, { useEffect, useRef } from "react";
import { Spotlight } from "./ui/spotlight";
import Link from "next/link";
import { Button } from "./ui/button";
import Github  from "@/components/github"
import Image from "next/image";

const Hero = () => {
  const imageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const imageElement = imageRef.current;
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThereshold = 100;
      if (scrollPosition > scrollThereshold) {
        imageElement?.classList.add("scrolled");
      } else {
        imageElement?.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="min-h-screeen mx-auto relative">
      <Github/>
      <div className="mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <Spotlight
          className="sm:-top-40 top-44 left-0 md:left-60 md:top-10"
          fill="blue"
        />
        <div className="text-center leading-8">
          <h1 className="bg-gradient-to-b from-neutral-400 to-neutral-800 dark:from-neutral-200 dark:to-neutral-500 bg-clip-text text-[40px] sm:text-5xl md:text-7xl font-bold leading-[150%] tracking-wide text-transparent relative">
            Transform your learning with <br />
            <span className="bg-gradient-to-b text-center from-blue-400 to-blue-700 bg-clip-text sm:text-7xl md:text-9xl text-[54px] tracking-wide font-semibold text-transparent">
              Contributions
            </span>
          </h1>
          <p className="sm:text-lg text-gray-400 text-sm">
            A platform where you can contribute to{" "}
            <br className="block md:hidden" /> real-world projects in a closed
            environment.
          </p>
        </div>
        <div className="mt-10">
          <Link href={"/sign-in"}>
            <Button
              className="text-slate-900 hover:text-slate-800 dark:hover:text-slate-200 dark:text-slate-100 font-bold rounded-full outline-blue-600 outline"
              variant={"outline"}
              size={"lg"}
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
      <div className="hero-image-wrapper mt-5 md:mt-0">
      <div ref={imageRef} className='hero-image'>
        <Image
          src={'/onboardingPage.png'}
          alt={'Onboarding Page'}
          width={'1280'}
          height={'100'}
          className="rounded-lg shadow-xl border mx-auto"
          priority
        />
      </div>
      </div>
    </div>
  );
};

export default Hero;
