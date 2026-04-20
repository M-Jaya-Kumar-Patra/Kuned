"use client";

import { useContext, useEffect, useState } from "react";
import api from "@/services/api";

import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import Loader from "@/components/ui/Loader";
import ProtectedRoute from "@/components/ProtectedRoute";

type CoinTransaction = {
  _id: string;
  amount: number;
  coinType: "bonus" | "paid";
  transactionType: "earn" | "spend";
  source: string;
  createdAt: string;
};


export default function CoinHistoryPage() {

  const auth = useContext(AuthContext);
    const router = useRouter();
  

  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [loading, setLoading] = useState(true);


  


  useEffect(() => {

    const fetchHistory = async () => {

      try {

        const res = await api.get("/coins/history");

        console.log("Coin history:", res.data);

        setTransactions(res.data);

      } catch (err) {

        console.error("Failed to load history", err);

      } finally {

        setLoading(false);

      }

    };

    fetchHistory();

  }, []);

  


  return (
    <ProtectedRoute>
  <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#e9ecff] px-4 py-8">

    <div className="max-w-4xl mx-auto">

      {/* HEADER */}
      <button
        onClick={() => window.history.back()}
        className="mb-4 text-sm text-gray-600 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-semibold text-gray-800">
        Coin History
      </h1>

      <p className="text-gray-500 mb-6">
        Track your earnings and spending
      </p>

      {/* SUMMARY CARD */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-2xl p-6 flex justify-between items-center mb-6 shadow">

        <div className="flex items-center gap-4">
          <img src="/images/quickLinks/coins.png" className="w-14" />
          <div>
            <p className="text-2xl md:text-3xl font-bold">
  {(auth?.user?.bonusCoins || 0) + (auth?.user?.paidCoins || 0)} coins
</p>
            <p className="text-sm opacity-80">Total Coins</p>
          </div>
        </div>

        <div className="text-sm text-right">
          <p>⭐ Bonus Coins</p>
          <p>💰 Paid Coins</p>
        </div>
      </div>

      {/* TRANSACTIONS */}
      {transactions.length === 0 ? (
        <div className="text-center mt-20 text-gray-500">
          <img
            src="/images/coins/empty.png"
            className="w-40 mx-auto mb-4"
          />
          <p className="text-lg font-medium">
            No transactions yet 🪙
          </p>
          <p className="text-sm">
            Your recent coin transactions will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">

          {transactions.map((t) => (
            <div
              key={t._id}
              className="bg-white/70 backdrop-blur-xl rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow transition"
            >

              {/* LEFT */}
              <div className="flex items-center gap-3">

                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${
                    t.transactionType === "earn"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {t.transactionType === "earn" ? "+" : "-"}
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    {t.source}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t.coinType === "bonus"
                      ? "Bonus Coins"
                      : "Paid Coins"}
                  </p>
                </div>

              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    t.transactionType === "earn"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {t.transactionType === "earn" ? "+" : "-"}
                  {t.amount} coins
                </p>

                <p className="text-xs text-gray-400">
                  {new Date(t.createdAt).toLocaleString()}
                </p>
              </div>

            </div>
          ))}

        </div>
      )}

    </div>


  </div>
  </ProtectedRoute>
  
);
}