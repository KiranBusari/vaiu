"use client";

import React, { useState } from "react";
import { LuSprout } from "react-icons/lu";
import { PiGearSixFill } from "react-icons/pi";
import { IoCalendar } from "react-icons/io5";
import { FaCrown } from "react-icons/fa";
import { PiBuildingsFill } from "react-icons/pi";
import { HiMiniTrophy } from "react-icons/hi2";

const Features = () => {
  const featuresData = [
    {
      id: 1,
      icon: <LuSprout className="text-green-600 w-6 h-6" />, // Use icon component directly
      title: "Basic",
      shortDescription: "Start contributing to real-world projects.",
      fullDescription:
        "Perfect for individuals who are new to the platform. Provides essential features for learning and contributing in a closed environment with guided support.",
    },
    {
      id: 2,
      icon: <PiGearSixFill className="text-gray-600 w-6 h-6" />,
      title: "Standard",
      shortDescription: "Take your contributions to the next level.",
      fullDescription:
        "Ideal for those who have some experience and are ready to handle more complex tasks. Includes features like team collaboration and progress tracking.",
    },
    {
      id: 3,
      icon: <IoCalendar className="text-blue-500 w-6 h-6" />,
      title: "Professional",
      shortDescription: "Designed for experienced contributors.",
      fullDescription:
        "Offers advanced tools to manage contributions efficiently. Includes mentorship options and access to larger real-world projects.",
    },
    {
      id: 4,
      icon: <FaCrown className="text-yellow-500 w-6 h-6" />,
      title: "Premium",
      shortDescription: "Maximize your learning potential.",
      fullDescription:
        "Unlock exclusive resources and personalized mentorship for significant impact on real-world projects. Tailored for serious learners.",
    },
    {
      id: 5,
      icon: <PiBuildingsFill className="text-indigo-500 w-6 h-6" />,
      title: "Enterprise",
      shortDescription: "For organizations and large teams.",
      fullDescription:
        "Custom solutions for large teams looking to contribute to impactful projects. Includes tools for monitoring and reporting progress.",
    },
    {
      id: 6,
      icon: <HiMiniTrophy className="text-orange-500 w-6 h-6" />,
      title: "Ultimate",
      shortDescription: "Experience the pinnacle of contribution.",
      fullDescription:
        "Designed for top-tier contributors and organizations. Includes full access to all features, priority support, and exclusive project access.",
    },
  ];

  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto pb-24 text-center">
      <h3 className="text-lg font-semibold flex dark:text-white pb-5">Features</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuresData.map((feature) => (
          <div
            key={feature.id}
            className="relative rounded-xl shadow-lg dark:bg-[#181818] p-6 group mb-10 hover:shadow-2xl transition"
          >
            <div className="absolute top-4 left-4 bg-blue-100 p-3 rounded-full shadow-md">
              {feature.icon} 
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-bold dark:text-white">{feature.title}</h2>
              <p className="text-gray-500 mt-2">{feature.shortDescription}</p>
            </div>

            <div className="relative mt-6">
              <button
                className="hover:text-blue-700 transition"
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                Read More...
              </button>

              {hoveredFeature === feature.id && (
                <div className="absolute top-full left-0 mt-2 w-full dark:bg-black bg-white dark:text-white border border-gray-300 shadow-xl p-4 rounded-md z-10">
                  <p className="text-sm leading-relaxed">{feature.fullDescription}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
