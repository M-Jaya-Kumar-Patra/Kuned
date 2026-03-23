"use client";

import { useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import Image from "next/image";

type CoinPackage = {
  id: string;
  coins: number;
  price: number;
};

const packages: CoinPackage[] = [
  { id: "starter", coins: 10, price: 1 },
  { id: "popular", coins: 25, price: 99 },
  { id: "pro", coins: 60, price: 199 },
];

export default function BuyCoinsPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleBuy = async (pkg: CoinPackage) => {
    try {
      setLoading(pkg.id);


      console.log("casssssssssssssssshhhhhhh")
      const token = localStorage.getItem("token");

      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          packageId: pkg.id,
        }),
      });

      const data = await res.json();

      if (!data.paymentSessionId) {
        alert("Payment session creation failed");
        return;
      }


      // ✅ LOAD SDK (CORRECT WAY)
      const cashfree = await load({
        mode:
          process.env.NEXT_PUBLIC_CASHFREE_ENV === "PRODUCTION"
            ? "production"
            : "sandbox",
      });


      await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      });



    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#f5f7ff] py-10 px-4">

    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold text-gray-800">
          Buy Coins
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          Boost your listings and sell faster 🚀
        </p>
        <p className="text-gray-400 mt-1">
          Use coins to make your listings more visible
        </p>
      </div>

      {/* Cards Container */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {packages.map((pkg) => {
            const isPopular = pkg.id === "popular";

            return (
              <div
                key={pkg.id}
                className={`relative rounded-2xl p-6 text-center transition shadow-sm ${
                  isPopular
                    ? "bg-white border-2 border-indigo-400 scale-105 shadow-lg"
                    : "bg-white/80"
                }`}
              >

                {/* Most Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-xs px-4 py-1 rounded-full shadow">
                    Most Popular
                  </div>
                )}

                {/* Coin Image */}
                <div className="flex justify-center mb-4">
                  <img
                    src="/images/quickLinks/coins.png"
                    alt="coins"
                    className="w-16 h-16 object-contain"
                  />
                </div>

                {/* Coins */}
                <h2 className="text-2xl font-semibold text-gray-800">
                  {pkg.coins} Coins
                </h2>

                {/* Divider */}
                <div className="w-full h-[1px] bg-gray-200 my-3"></div>

                {/* Price */}
                <p className="text-3xl font-bold text-gray-800">
                  ₹{pkg.price}
                </p>

                {/* Divider */}
                <div className="w-full h-[1px] bg-gray-200 my-3"></div>

                {/* Subtitle */}
                <p className="text-sm text-gray-500">
                  {pkg.id === "starter" && "Casual sellers"}
                  {pkg.id === "popular" && "Best value"}
                  {pkg.id === "pro" && "Power sellers"}
                </p>

                {/* Button */}
                <button
                  onClick={() => handleBuy(pkg)}
                  disabled={loading === pkg.id}
                  className="mt-5 w-full py-2 cursor-pointer rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading === pkg.id ? "Processing..." : "Buy Now"}
                </button>

                {/* Bottom text */}
                <p className="text-xs text-gray-400 mt-2">
                  {pkg.id === "starter" && "Casual sellers"}
                  {pkg.id === "popular" && "Best value"}
                  {pkg.id === "pro" && "Power sellers"}
                </p>

              </div>
            );
          })}
        </div>

        {/* Payment Section */}
        <div className="mt-8 border-t pt-6 text-center">

          <p className="text-gray-700 font-medium flex items-center justify-center gap-2">
  Secure payments powered by
  <Image
    src="https://cashfreelogo.cashfree.com/website/landings/homepage/cashfreeLogo.png"
    alt="Cashfree"
    width={100}
    height={24}
  />
</p>

          <div className="flex justify-center gap-8 mt-4 text-sm text-gray-500">
            <span>🔒 Secure</span>
            <span>⚡ Instant credit</span>
            <span>💳 Multiple payment options</span>
          </div>

        </div>

      </div>

      {/* Usage Section */}
      <div className="mt-8 bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow">

        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Usage
        </h3>

        <div className="space-y-2 text-gray-600">
          <p>⭐ Top Listing → 5 coins</p>
          <p>🚨 Urgent → 2 coins</p>
          <p>🔥 Highlight → 3 coins</p>
        </div>

      </div>

    </div>
  </div>
);
}