'use client';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle,  BarChart2, Clock, Users, Zap, ChevronRight, Star } from "lucide-react"
import { useState } from "react";

export default function BoldDesign() {
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null);
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-slate-50">
      <main className="flex-1">     
        <section className="w-full  py-20 border-t" id="features">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-transparent px-3 py-1 sm:text-5xl md:text-7xl text-sm text-white ring-1 ring-blue-600">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-5xl/tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Powerful tools for powerful teams
                </h2>
                <p className="max-w-[900px] text-blue-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Vaiu provides everything you need to take your project management to the next level.
                </p>
              </div>
            </div>
            <div className="grid gap-6 py-12 lg:grid-cols-3">
              {[
                {
                  icon: <BarChart2 className="h-10 w-10" />,
                  title: "Advanced Analytics",
                  description:
                    "Gain deep insights into your team's performance with customizable dashboards and real-time metrics.",
                },
                {
                  icon: <Clock className="h-10 w-10" />,
                  title: "Time Tracking",
                  description:
                    "Track time spent on tasks and projects to improve estimation accuracy and resource allocation.",
                },
                {
                  icon: <Users className="h-10 w-10" />,
                  title: "Team Collaboration",
                  description:
                    "Enhance team communication with integrated chat, comments, and file sharing capabilities.",
                },
                {
                  icon: <Zap className="h-10 w-10" />,
                  title: "Automation",
                  description: "Automate repetitive tasks and workflows to save time and reduce manual errors.",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
                  className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg hover:shadow-purple-500/5 transition-all hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    <div className="text-blue-600">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                    <Link href="#" className="inline-flex items-center text-blue-600 hover:text-blue-300">
                      Learn more <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-20 bg-transparent" id="testimonials">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full px-3 py-1 text-sm text-white ring-1 ring-blue-600">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-5xl/tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Loved by teams worldwide
                </h2>
                <p className="max-w-[900px] text-blue-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See what our customers have to say about vaiuPro.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg">
                  <div className="flex flex-col gap-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 fill-blue-600 text-blue-600" />
                      ))}
                    </div>
                    <p className="text-slate-300">
                      "vaiuPro has transformed how our team manages projects. The real-time analytics and automation
                      features have significantly improved our productivity."
                    </p>
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
                      <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                        <span className="font-semibold text-blue-600">{String.fromCharCode(64 + i)}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-white">Jane Smith</div>
                        <div className="text-xs text-slate-400">Project Manager, Acme Inc.</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-40 relative overflow-hidden" id="cta">
          <div className="absolute inset-0 bg-transparent
          "></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-5"></div>
          <div className="container relative px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-5xl/tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Ready to transform your workflow?
                </h2>
                <p className="max-w-[900px] text-blue-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of teams who have revolutionized their project management with vaiuPro.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 bg-transparent border-blue-600 text-white placeholder:text-slate-400 focus-visible:ring-blue-500"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button className="bg-transparent ring-2 ring-blue-500 rounded-full text-white" variant="ghost">
                    Get Started
                  </Button>
                </form>
                <p className="text-xs text-slate-200">Start your 14-day free trial. No credit card required.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-20" id="pricing">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-purple-500/10 px-3 py-1 text-sm text-white ring-1 ring-blue-600">
                  Pricing
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-5xl/tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Simple, transparent pricing
                </h2>
                <p className="max-w-[900px] text-blue-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that's right for your team.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
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
                      : "border-slate-800 bg-slate-900/50 hover:ring-1 hover:ring-blue-400/50"} 
                    p-6 shadow-lg`}
                >
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">{plan.title}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white">{plan.price}</span>
                      <span className="text-slate-400">/month per user</span>
                    </div>
                    <p className="text-sm text-slate-400">{plan.description}</p>
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          <span className="text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${
                        selectedPlanIndex === i
                          ? "bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-500 text-white "
                          : "border-slate-700 text-white hover:bg-slate-800"
                      }`}
                      variant={selectedPlanIndex === i ? "default" : "outline"}
                    >
                      {selectedPlanIndex === i ? "Selected" : "Get Started"}
                    </Button>
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