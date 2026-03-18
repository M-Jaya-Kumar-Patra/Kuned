"use client";

import { useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";

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


      console.log("casssssssssssssssshhhhhhh",  cashfree)
      console.log("iiiiiiiiiiiiiiiiiiidddddddddd",  data)

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
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-10 text-center">Buy Coins</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="border rounded-lg p-6 text-center shadow-sm"
          >
            <h2 className="text-xl font-semibold">{pkg.coins} Coins</h2>

            <p className="text-lg mt-2 text-gray-600">₹{pkg.price}</p>

            <button
              onClick={() => handleBuy(pkg)}
              disabled={loading === pkg.id}
              className="bg-black text-white px-5 py-2 mt-4 rounded hover:bg-gray-800 disabled:opacity-50"
            >
              {loading === pkg.id ? "Processing..." : "Buy Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}