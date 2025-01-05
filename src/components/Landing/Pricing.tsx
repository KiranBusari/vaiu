import React from "react";
import Rocket from "@/components/Landing/images/rocket.png";
import Cup from "@/components/Landing/images/cup.png";

const Pricing = () => {
  return (
    <div className="max-w-7xl mx-auto pb-10 text-center">
      <h3 className="text-lg font-semibold dark:text-white">Our Pricing</h3>
      <h1 className="text-4xl font-bold text-gray-600 mt-2 mb-4">
        Choose the Plan That Suits You Best
      </h1>
      <p className="text-gray-500 mb-10">
        Discover the perfect pricing plan to fuel your growth and achieve your
        goals. We offer flexible options to fit your budget and needs.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 gap-10">
        <div className=" rounded-xl shadow-lg dark:bg-[#181818] p-6 relative ">
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-100 p-3 rounded-full shadow-md">
              <img src={Rocket.src} alt="Rocket Icon" className="w-8 h-8 " />
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-lg font-bold dark:text-white">STARTER</h2>
            <p className="text-gray-500 mt-2">
              Ideal for startups and small businesses.
            </p>
            <p className="text-4xl font-bold text-blue-600 mt-4">$29.99</p>
            <p className="text-gray-500 text-sm">/ month</p>
            <ul className="text-left mt-4 space-y-2 pl-28 lg:pl-14 text-gray-600">
              <li className="dark:text-white">
                <span className="text-blue-600 font-bold">✔</span> 1 User
                Account
              </li>
              <li className="dark:text-white">
                <span className="text-blue-600 font-bold">✔</span> Basic
                Analytics
              </li>
              <li className="dark:text-white">
                <span className="text-blue-600 font-bold">✔</span> Limited
                Support
              </li>
              <li className="dark:text-white">
                <span className="text-blue-600 font-bold">✔</span> Essential
                Features
              </li>
              <li className="dark:text-white">
                <span className="text-blue-600 font-bold">✔</span> Consectetur
                Adipisicing
              </li>
            </ul>
            <button className="mt-6 border-[3px] rounded-tr-2xl font-bold rounded-bl-2xl border-blue-600 dark:text-white px-6 py-2 rounded-md hover:bg-slate-300 dark:hover:bg-slate-800 transition">
              Get Started
            </button>
          </div>
        </div>

        <div className=" rounded-xl shadow-lg dark:bg-[#181818] p-6 relative ">
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-100 p-3 rounded-full shadow-md">
              <img src={Cup.src} alt="Rocket Icon" className="w-8 h-8 " />
            </div>
          </div>
          <h1 className="flex absolute right-0 top-0 rounded-sm rounded-tl-none rounded-br-none border bg-blue-600 w-fit px-4 text-white ">
            Best seller
          </h1>
          <div className="mt-8">
            <h2 className="text-lg font-bold dark:text-white">GROWTH</h2>
            <p className="text-gray-500 mt-2">
              Designed for scaling businesses.
            </p>
            <p className="text-4xl font-bold text-blue-600 mt-4">$59.99</p>
            <p className="text-gray-500 text-sm">/ month</p>
            <ul className="text-left mt-4 space-y-2 pl-28 lg:pl-14 text-gray-600">
              <li className="dark:text-white">
                <span className="text-blue-600 font-bold text-xl">←</span> All
                Starter Features
              </li>
              <li className="dark:text-white">
                <span className="text-blue-600 font-bold">✔</span> Multiple
                User Accounts
              </li>
              <li className="dark:text-white">
                <span className="text-blue-600 font-bold">✔</span> Advanced
                Analytics
              </li>
              <li className="dark:text-white">
                <span className="text-blue-600 font-bold">✔</span> Priority
                Support
              </li>
              <li className="dark:text-white">
                <span className="text-blue-600 font-bold">✔</span> All
                Essential Features
              </li>
            </ul>
            <button className="mt-6 border-[3px] rounded-tr-2xl font-bold rounded-bl-2xl border-blue-600 dark:text-white px-6 py-2 rounded-md hover:bg-slate-300 dark:hover:bg-slate-800 transition">
              Get Started
            </button>
          </div>
        </div>

        <div className=" rounded-xl shadow-lg dark:bg-[#181818] p-6 relative ">
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-100 p-3 rounded-full shadow-md">
              <img src={Rocket.src} alt="Rocket Icon" className="w-8 h-8 " />
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-lg font-bold dark:text-white">ENTERPRISE</h2>
            <p className="text-gray-500 mt-2">
              For high-growth businesses with demanding needs.
            </p>
            <p className="text-4xl font-bold text-blue-600 mt-4">$99.99</p>
            <p className="text-gray-500 text-sm">/ month</p>
            <ul className="text-left mt-4 space-y-2 pl-28 lg:pl-14 text-gray-600">
              <li className="dark:text-white">
                <span className="text-blue-600 font-bold text-xl">←</span> All
                Growth Features
              </li>
              <li className="dark:text-white">
                <span className="text-blue-600 font-bold">✔</span> Unlimited
                User Accounts
              </li>
              <li className="dark:text-white">
                <span className="text-blue-600 font-bold">✔</span> Dedicated
                Account Manager
              </li>
              <li className="dark:text-white">
                <span className="text-blue-600 font-bold">✔</span> All Features
                & Integrations
              </li>
              <li className="dark:text-white">
                <span className="text-blue-600 font-bold">✔</span> Custom
                Solutions
              </li>
            </ul>
            <button className="mt-6 border-[3px] rounded-tr-2xl  font-bold rounded-bl-2xl border-blue-600 dark:text-white px-6 py-2 rounded-md hover:bg-slate-300 dark:hover:bg-slate-800 transition">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
