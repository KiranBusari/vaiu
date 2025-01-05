"use client";

import React, { useState } from "react";
import Sprout from "@/components/Landing/images/sprout.png";  
import Gear from "@/components/Landing/images/gear.png";  
import Cal from "@/components/Landing/images/cal.png";
import Pre from "@/components/Landing/images/pre.png";
import Building from "@/components/Landing/images/build.png";
import Trophy from "@/components/Landing/images/trophy.png";

const Features = () => {
  const featuresData = [
    {
      id: 1,
      icon: Sprout,  
      title: "Basic",
      shortDescription: "Start contributing to real-world projects.",
      fullDescription:
        "Perfect for individuals who are new to the platform. Provides essential features for learning and contributing in a closed environment with guided support.",
    },
    {
      id: 2,
      icon: Gear,
      title: "Standard",
      shortDescription: "Take your contributions to the next level.",
      fullDescription:
        "Ideal for those who have some experience and are ready to handle more complex tasks. Includes features like team collaboration and progress tracking.",
    },
    {
      id: 3,
      icon: Cal,
      title: "Professional",
      shortDescription: "Designed for experienced contributors.",
      fullDescription:
        "Offers advanced tools to manage contributions efficiently. Includes mentorship options and access to larger real-world projects.",
    },
    {
      id: 4,
      icon: Pre,
      title: "Premium",
      shortDescription: "Maximize your learning potential.",
      fullDescription:
        "Unlock exclusive resources and personalized mentorship for significant impact on real-world projects. Tailored for serious learners.",
    },
    {
      id: 5,
      icon: Building,
      title: "Enterprise",
      shortDescription: "For organizations and large teams.",
      fullDescription:
        "Custom solutions for large teams looking to contribute to impactful projects. Includes tools for monitoring and reporting progress.",
    },
    {
      id: 6,
      icon: Trophy,
      title: "Ultimate",
      shortDescription: "Experience the pinnacle of contribution.",
      fullDescription:
        "Designed for top-tier contributors and organizations. Includes full access to all features, priority support, and exclusive project access.",
    },
  ];

  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto pb-24 text-center">
      <h3 className="text-lg font-semibold dark:text-white left-0 flex pb-5">Our Features</h3>
      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuresData.map((feature) => (
          <div
            key={feature.id}
            className="relative rounded-xl shadow-lg dark:bg-[#181818] p-6 group hover:shadow-2xl transition"
          >
            <div className="absolute top-4 left-4 bg-blue-100 p-3 rounded-full shadow-md">
              <img
                src={typeof feature.icon === 'string' ? feature.icon : feature.icon.src}
                alt={`${feature.title} Icon`}
                className="w-6 h-6"
              />
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
