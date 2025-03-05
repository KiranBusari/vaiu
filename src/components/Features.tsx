'use client';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, BarChart2, Clock, Users, Zap, ChevronRight, Star } from "lucide-react"
import { useState } from "react";


export default function BoldDesign() {
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null);
  return (
    <div className="flex min-h-screen flex-col ">
      <main className="flex-1">     
        <section className="w-full py-12 md:py-20" id="features">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full  px-3 py-1 text-5xl font-bold dark:text-white text-gray-500">
                  Features
                </div>
                <h2 className="text-2xl md:text-3xl tracking-wide text-gray-500 dark:text-white">
                  Powerful tools for powerful teams
                </h2>
                <p className="max-w-[900px] text-blue-500 text-sm md:text-base lg:text-base/relaxed xl:text-xl/relaxed">
                  Vaiu provides everything you need to take your project management to the next level.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 py-8 md:py-12">
              {[
                {
                  icon: <BarChart2 className="h-8 md:h-10 w-8 md:w-10" />,
                  title: "Advanced Analytics",
                  description:
                    "Gain deep insights into your team's performance with customizable dashboards and real-time metrics.",
                },
                {
                  icon: <Clock className="h-8 md:h-10 w-8 md:w-10" />,
                  title: "Time Tracking",
                  description:
                    "Track time spent on tasks and projects to improve estimation accuracy and resource allocation.",
                },
                {
                  icon: <Users className="h-8 md:h-10 w-8 md:w-10" />,
                  title: "Team Collaboration",
                  description:
                    "Enhance team communication with integrated chat, comments, and file sharing capabilities.",
                },
                {
                  icon: <Zap className="h-8 md:h-10 w-8 md:w-10" />,
                  title: "Automation",
                  description: "Automate repetitive tasks and workflows to save time and reduce manual errors.",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="md:w-10 md:h-10"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M9 9h6v6H9z" />
                    </svg>
                  ),
                  title: "Custom Fields",
                  description: "Create and manage custom fields to tailor vaiu to your specific project requirements.",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="md:w-10 md:h-10"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="M12 8v4l3 3" />
                    </svg>
                  ),
                  title: "Reporting",
                  description:
                    "Generate comprehensive reports to track progress, identify bottlenecks, and make data-driven decisions.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-800 dark:bg-slate-900/50 p-4 md:p-6 shadow-lg hover:shadow-purple-500/5 transition-all hover:-translate-y-1"
                >
                  <div className="space-y-3 md:space-y-4">
                    <div className="text-blue-600">{feature.icon}</div>
                    <h3 className="text-lg md:text-xl font-bold text-white">{feature.title}</h3>
                    <p className="text-sm md:text-base text-slate-500">{feature.description}</p>
                    <Link href="#" className="inline-flex items-center text-sm md:text-base text-blue-600 hover:text-blue-300">
                      Learn more <ChevronRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-20 bg-transparent" id="testimonials">
  <div className="container px-4 md:px-6">
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <div className="space-y-2">
        <div className="inline-block px-3 py-1 text-5xl font-bold dark:text-white  text-gray-500">
          Testimonials
        </div>
        <h2 className="text-2xl md:text-3xl  tracking-wide dark:text-white text-gray-500">
          Loved by teams worldwide
        </h2>
        <p className="max-w-[900px] text-blue-600 text-sm md:text-base lg:text-base/relaxed xl:text-xl/relaxed">
          See what our customers have to say about Vaiu.
        </p>
      </div>
    </div>
    <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl gap-6 py-8 md:py-12">
      {[
        {
          stars: 5,
          quote: "Vaiu transformed our team's workflow completely. The advanced analytics helped us identify bottlenecks we never knew existed, and the automation features saved us 15+ hours per week.",
          name: "Sarah Chen",
          title: "CTO, TechForward Inc."
        },
        {
          stars: 5,
          quote: "The collaboration tools in Vaiu are unmatched. Our remote team finally feels connected, and our project delivery time has decreased by 30% since implementation.",
          name: "Marcus Johnson",
          title: "Head of Product, Nexus Solutions"
        },
        {
          stars: 4,
          quote: "Customer support is exceptional! When we had questions about custom integrations, the team went above and beyond to help us create a perfect workflow for our unique needs.",
          name: "Aisha Patel",
          title: "Operations Manager, GlobalWorks Ltd."
        }
      ].map((testimonial, i) => (
        <div key={i} className="rounded-xl border border-slate-800 dark:bg-slate-900/50 p-4 md:p-6 shadow-lg">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex">
              {[...Array(testimonial.stars)].map((_, star) => (
                <Star key={star} className="h-4 w-4 md:h-5 md:w-5 fill-blue-600 text-blue-600" />
              ))}
              {[...Array(5-testimonial.stars)].map((_, star) => (
                <Star key={star + testimonial.stars} className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              ))}
            </div>
            <p className="text-sm md:text-base dark:text-slate-300 text-gray-500">
              &quot;{testimonial.quote}&quot;
            </p>
            <div className="flex items-center gap-3 md:gap-4 pt-3 md:pt-4 border-t border-slate-800">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full dark:bg-slate-800 flex items-center justify-center">
                <span className="font-semibold text-blue-600">{testimonial.name.charAt(0)}</span>
              </div>
              <div>
                <div className="font-semibold text-sm md:text-base text-white">{testimonial.name}</div>
                <div className="text-xs dark:text-slate-400">{testimonial.title}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
        <section className="w-full py-12 md:py-20" id="pricing">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block font-bold text-5xl px-3 py-1 dark:text-white text-gray-500">
                  Pricing
                </div>
                <h2 className="text-2xl md:text-3xl tracking-wide bg-gradient-to-r dark:text-white text-gray-500">
                  Simple, transparent pricing
                </h2>
                <p className="max-w-[900px] text-blue-600 text-sm md:text-base lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that&apos;s right for your team.
                </p>
              </div>
            </div>
            <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl gap-6 py-8 md:py-12">
            {[
              {
                  title: "Starter",
                  price: "$9",
                  description: "Perfect for small teams just getting started.",
                  features: ["Up to 5 users", "Basic analytics", "Standard support", "1 project"],
                },
                {
                  title: "Professional",
                  price: "$29",
                  description: "Ideal for growing teams with more complex needs.",
                  features: ["Up to 20 users", "Advanced analytics", "Priority support", "Unlimited projects"],
                },
                {
                  title: "Enterprise",
                  price: "$99",
                  description: "For large organizations with advanced requirements.",
                  features: ["Unlimited users", "Custom analytics", "24/7 support", "Dedicated account manager"],
                },
              ].map((plan, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedPlanIndex(i)}
                  className={`rounded-xl border cursor-pointer transition-all duration-300
                    ${selectedPlanIndex === i 
                      ? "border-blue-500 bg-gradient-to-b from-blue-900/20 to-slate-900/90 shadow-purple-500/10 ring-2 ring-blue-500 transform scale-[1.02]" 
                      : "border-slate-800  bg-white dark:bg-slate-900/50 hover:ring-1 hover:ring-blue-400/50"} 
                    p-4 md:p-6 shadow-lg`}
                >
                  <div className="space-y-3 md:space-y-4">
                    <h3 className="text-lg md:text-xl font-bold text-gray-500 dark:text-white">{plan.title}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl md:text-3xl font-bold text-gray-500 dark:text-white">{plan.price}</span>
                      <span className="text-xs md:text-sm text-slate-500">/month per user</span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500">{plan.description}</p>
                    <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                          <span className="text-gray-500 dark:text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full text-sm md:text-base ${
                        selectedPlanIndex === i
                          ? "bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-500 text-white"
                          : "border-slate-700 dark:text-white text-gray-500 hover:bg-slate-800"
                      }`}
                      variant={selectedPlanIndex === i ? "default" : "outline"}
                    >
                      {selectedPlanIndex === i ? "Selected" : "Get Started"}
                    </Button>   {/* Fix the hove effect  in both dark and light mode*/}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
       </main>
     </div>
  )
}