"use client";

import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepsProps {
  steps: Array<{
    title: string;
    description: string;
    images: string[];
  }>;
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function Steps({ steps, currentStep, onStepClick }: StepsProps) {
  return (
    <div className="flex flex-col space-y-4">
      {steps.map((step, index) => (
        <div
          key={index}
          className={cn(
            "flex cursor-pointer items-center space-x-4",
            currentStep === index && "text-primary",
          )}
          onClick={() => onStepClick(index)}
        >
          {index < currentStep ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : (
            <Circle
              className={cn(
                "h-6 w-6",
                currentStep === index && "fill-primary/20",
              )}
            />
          )}
          <span className="font-medium">{step.title}</span>
        </div>
      ))}
    </div>
  );
}
