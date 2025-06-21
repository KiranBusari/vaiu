"use client";

import { useState } from "react";
import axios from "axios";

export default function PaymentPage() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      name: name,
      amount: amount,
      mobile,
      MUID: "MUID" + Date.now(),
      transactionId: "T" + Date.now(),
    };

    try {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/payment-gateway/order`,
          data,
        )
        .then((response) => {
          if (
            response.data &&
            response.data.data.instrumentResponse.redirectInfo.url
          ) {
            window.location.href =
              response.data.data.instrumentResponse.redirectInfo.url;
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="flex h-screen items-center justify-center bg-gradient-to-r from-indigo-50 to-green-500">
        <div className="flex max-w-4xl flex-col items-center rounded-lg bg-white p-8 lg:flex-row">
          <div className="w-full flex-col items-center justify-center lg:w-1/2">
            <div className="p-10"></div>
            <video
              src="https://www.phonepe.com/webstatic/8020/videos/page/home-fast-secure-v3.mp4"
              autoPlay
              loop
              muted
              className="rounded-lg"
            />
          </div>

          <div className="mt-8 w-full lg:ml-8 lg:mt-0 lg:w-1/2">
            <div className="rounded-lg bg-green-500 p-8 shadow-md">
              <h2 className="mb-6 text-center text-3xl font-bold text-white">
                Make a Payment
              </h2>
              <form onSubmit={handlePayment} className="space-y-6">
                <div>
                  <label
                    htmlFor="Name"
                    className="block text-sm font-medium text-white"
                  >
                    Name
                  </label>
                  <div className="relative mt-2">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      😎
                    </span>
                    <input
                      id="Name"
                      name="Name"
                      type="text"
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      required
                      placeholder="Enter your name"
                      className="block w-full rounded-lg bg-white py-2 pl-10 pr-4 text-gray-900 shadow-sm focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="Mobile"
                    className="block text-sm font-medium text-white"
                  >
                    Mobile
                  </label>
                  <div className="relative mt-2">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      📞
                    </span>
                    <input
                      id="Mobile"
                      name="Mobile"
                      type="text"
                      required
                      onChange={(e) => {
                        setMobile(e.target.value);
                      }}
                      placeholder="Enter your mobile number"
                      className="block w-full rounded-lg bg-white py-2 pl-10 pr-4 text-gray-900 shadow-sm focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="Amount"
                    className="block text-sm font-medium text-white"
                  >
                    Amount
                  </label>
                  <div className="relative mt-2">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      ₹
                    </span>
                    <input
                      id="Amount"
                      name="Amount"
                      type="text"
                      required
                      onChange={(e) => {
                        setAmount(e.target.value);
                      }}
                      placeholder="0.00"
                      className="block w-full rounded-lg bg-white py-2 pl-10 pr-16 text-gray-900 shadow-sm focus:ring-2 focus:ring-purple-400"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <select
                        id="currency"
                        name="currency"
                        className="h-full border-none bg-transparent py-0 pl-2 pr-4 text-gray-500 focus:outline-none focus:ring-0"
                      >
                        <option>INR</option>
                        <option>CAD</option>
                        <option>EUR</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-blue-500 py-3 text-lg font-semibold text-white"
                >
                  {loading ? "processing...." : "Pay Now"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
