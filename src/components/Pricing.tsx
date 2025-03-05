"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { CheckCircle } from "lucide-react";

const Pricing = () => {
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(
    null,
  );

  return (
    <section className="w-full py-12 md:py-20" id="pricing">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block px-3 py-1 text-5xl font-bold text-gray-500 dark:text-white">
              Pricing
            </div>
            <h2 className="bg-gradient-to-r text-2xl tracking-wide text-gray-500 dark:text-white md:text-3xl">
              Simple, transparent pricing
            </h2>
            <p className="max-w-[900px] text-sm text-blue-600 md:text-base lg:text-base/relaxed xl:text-xl/relaxed">
              Choose the plan that&apos;s right for your team.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-8 md:grid-cols-2 md:py-12 lg:grid-cols-3">
          {[
            {
              title: "Starter",
              price: "$9",
              description: "Perfect for small teams just getting started.",
              features: [
                "Up to 5 users",
                "Basic analytics",
                "Standard support",
                "1 project",
              ],
            },
            {
              title: "Professional",
              price: "$29",
              description: "Ideal for growing teams with more complex needs.",
              features: [
                "Up to 20 users",
                "Advanced analytics",
                "Priority support",
                "Unlimited projects",
              ],
            },
            {
              title: "Enterprise",
              price: "$99",
              description:
                "For large organizations with advanced requirements.",
              features: [
                "Unlimited users",
                "Custom analytics",
                "24/7 support",
                "Dedicated account manager",
              ],
            },
          ].map((plan, i) => (
            <div
              key={i}
              onClick={() => setSelectedPlanIndex(i)}
              className={`cursor-pointer rounded-xl border transition-all duration-300 ${
                selectedPlanIndex === i
                  ? "scale-[1.02] transform border-blue-500 bg-gradient-to-b from-blue-900/20 to-slate-900/90 shadow-purple-500/10 ring-2 ring-blue-500"
                  : "border-slate-800 bg-white hover:ring-1 hover:ring-blue-400/50 dark:bg-slate-900/50"
              } p-4 shadow-lg md:p-6`}
            >
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-lg font-bold text-gray-500 dark:text-white md:text-xl">
                  {plan.title}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-500 dark:text-white md:text-3xl">
                    {plan.price}
                  </span>
                  <span className="text-xs text-slate-500 md:text-sm">
                    /month per user
                  </span>
                </div>
                <p className="text-xs text-gray-500 md:text-sm">
                  {plan.description}
                </p>
                <ul className="space-y-1 text-xs md:space-y-2 md:text-sm">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-blue-600 md:h-4 md:w-4" />
                      <span className="text-gray-500 dark:text-slate-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full text-sm md:text-base ${
                    selectedPlanIndex === i
                      ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-500"
                      : "border-slate-700 text-gray-500 hover:bg-slate-800 dark:text-white"
                  }`}
                  variant={selectedPlanIndex === i ? "default" : "outline"}
                >
                  {selectedPlanIndex === i ? "Selected" : "Get Started"}
                </Button>{" "}
                {/* Fix the hove effect  in both dark and light mode*/}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
