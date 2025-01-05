import React from "react";
import Rocket from "@/components/Landing/images/rocket.png";
import Cup from "@/components/Landing/images/cup.png";

const Pricing = () => {
  return (
    <div className="max-w-7xl mx-auto pb-10 text-center">
      
      <h3 className="text-lg font-semibold dark:text-white">OUR PRICING</h3>
      <h1 className="text-4xl font-bold text-gray-600 mt-2 mb-4">Reasonable Pricing Plan</h1>
      <p className="text-gray-500 mb-10">
        Dolorum tempor quis dictum tempore, curabitur commodo sec inventore aute
        maecenas commodo, nibh.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      
        <div className="border rounded-xl shadow-lg bg-white p-6 relative">
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
            <div className="bg-purple-100 p-3 rounded-full shadow-md">
              <img
                src={Rocket.src}
                alt="Rocket Icon"
                className="w-8 h-8 "
              />
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-800">STARTER PLAN</h2>
            <p className="text-gray-500 mt-2">Perfect Plan for Starters.</p>
            <p className="text-4xl font-bold text-purple-600 mt-4">$35.89</p>
            <p className="text-gray-500 text-sm">/ month</p>
            <ul className="text-left mt-4 space-y-2 text-gray-600">
              <li>✔ Eleifend aut maxime metus.</li>
              <li>✔ Rhoncus commodo port.</li>
              <li>✔ Nisl netus, consequen.</li>
              <li>✔ Ullam elit diamlorem eum.</li>
              <li>✔ Litora molestias omnis.</li>
            </ul>
            <button className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition">
              Get Started
            </button>
          </div>
        </div>

        <div className="border rounded-xl shadow-lg bg-purple-600 text-white p-6 relative">
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
            <div className="bg-purple-100 p-3 rounded-full shadow-md">
              <img
                src={Cup.src}
                alt="Cup Icon"
                className="w-8 h-8"
              />
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-lg font-bold">ENTERPRISE</h2>
            <p className="mt-2">True Power of Marketing.</p>
            <p className="text-4xl font-bold mt-4">$79.59</p>
            <p className="text-sm">/ month</p>
            <ul className="text-left mt-4 space-y-2">
              <li>✔ Eleifend aut maxime metus.</li>
              <li>✔ Rhoncus commodo port.</li>
              <li>✔ Nisl netus, consequen.</li>
              <li>✔ Ullam elit diamlorem eum.</li>
              <li>✔ Litora molestias omnis.</li>
            </ul>
            <button className="mt-6 bg-white text-purple-600 px-6 py-2 rounded-md hover:bg-gray-100 transition">
              Get Started
            </button>
          </div>
        </div>

        <div className="border rounded-xl shadow-lg bg-white p-6 relative">
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
            <div className="bg-purple-100 p-3 rounded-full shadow-md">
              <img
                src={Rocket.src}
                alt="Circle Icon"
                className="w-8 h-8"
              />
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-800">COMMERCIAL</h2>
            <p className="text-gray-500 mt-2">Collaborate Professionally.</p>
            <p className="text-4xl font-bold text-purple-600 mt-4">$50.79</p>
            <p className="text-gray-500 text-sm">/ month</p>
            <ul className="text-left mt-4 space-y-2 text-gray-600">
              <li>✔ Eleifend aut maxime metus.</li>
              <li>✔ Rhoncus commodo port.</li>
              <li>✔ Nisl netus, consequen.</li>
              <li>✔ Ullam elit diamlorem eum.</li>
              <li>✔ Litora molestias omnis.</li>
            </ul>
            <button className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
