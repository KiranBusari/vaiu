import { Star } from "lucide-react";
import React from "react";

const Testimonials = () => {
  return (
    <section className="w-full bg-transparent py-12 md:py-20" id="testimonials">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block px-3 py-1 text-5xl font-bold text-gray-500 dark:text-white">
              Testimonials
            </div>
            <h2 className="text-2xl tracking-wide text-gray-500 dark:text-white md:text-3xl">
              Loved by teams worldwide
            </h2>
            <p className="max-w-[900px] text-sm text-blue-600 md:text-base lg:text-base/relaxed xl:text-xl/relaxed">
              See what our customers have to say about Vaiu.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-8 md:grid-cols-2 md:py-12 lg:grid-cols-3">
          {[
            {
              stars: 5,
              quote:
                "Vaiu transformed our team's workflow completely. The advanced analytics helped us identify bottlenecks we never knew existed, and the automation features saved us 15+ hours per week.",
              name: "Sarah Chen",
              title: "CTO, TechForward Inc.",
            },
            {
              stars: 5,
              quote:
                "The collaboration tools in Vaiu are unmatched. Our remote team finally feels connected, and our project delivery time has decreased by 30% since implementation.",
              name: "Marcus Johnson",
              title: "Head of Product, Nexus Solutions",
            },
            {
              stars: 4,
              quote:
                "Customer support is exceptional! When we had questions about custom integrations, the team went above and beyond to help us create a perfect workflow for our unique needs.",
              name: "Aisha Patel",
              title: "Operations Manager, GlobalWorks Ltd.",
            },
          ].map((testimonial, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-800 p-4 shadow-lg dark:bg-slate-900/50 md:p-6"
            >
              <div className="flex flex-col gap-3 md:gap-4">
                <div className="flex">
                  {[...Array(testimonial.stars)].map((_, star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-blue-600 text-blue-600 md:h-5 md:w-5"
                    />
                  ))}
                  {[...Array(5 - testimonial.stars)].map((_, star) => (
                    <Star
                      key={star + testimonial.stars}
                      className="h-4 w-4 text-blue-600 md:h-5 md:w-5"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-slate-300 md:text-base">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center gap-3 border-t border-slate-800 pt-3 md:gap-4 md:pt-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full dark:bg-slate-800 md:h-10 md:w-10">
                    <span className="font-semibold text-blue-600">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white md:text-base">
                      {testimonial.name}
                    </div>
                    <div className="text-xs dark:text-slate-400">
                      {testimonial.title}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
