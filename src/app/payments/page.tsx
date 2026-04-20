"use client";


import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";


type Payment = {
  _id: string;
  orderId: string;
  amount: number;
  coins: number;
  status: string;
  createdAt: string;
};

export default function PaymentHistoryPage() {
  
  const [payments, setPayments] = useState<Payment[]>([]);

  

  useEffect(() => {
    const fetchPayments = async () => {

      const res = await fetch("/api/payments/history", {
  credentials: "include", // ✅ ADD THIS
});

      const data = await res.json();
      setPayments(data.payments || []);
    };

    fetchPayments();
  }, []);

  return (
    <ProtectedRoute>
  <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#e9ecff] px-4 py-8">

    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <h1 className="text-3xl font-semibold text-gray-800">
        Payment History
      </h1>
      <p className="text-gray-500 mb-6">
        Track all your coin purchases
      </p>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 shadow flex items-center gap-3">
          <div className="text-yellow-500 text-2xl">💰</div>
          <div>
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-xl font-bold text-gray-800">
              ₹{payments.reduce((acc, p) => acc + p.amount, 0)}
            </p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 shadow flex items-center gap-3">
          <div className="text-yellow-500 text-2xl">🪙</div>
          <div>
            <p className="text-sm text-gray-500">Total Coins Purchased</p>
            <p className="text-xl font-bold text-gray-800">
              {payments.reduce((acc, p) => acc + p.coins, 0)} coins
            </p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 shadow flex items-center gap-3">
          <div className="text-green-500 text-2xl">✔️</div>
          <div>
            <p className="text-sm text-gray-500">Successful Payments</p>
            <p className="text-xl font-bold text-gray-800">
              {payments.filter(p => p.status === "success").length}
            </p>
          </div>
        </div>

      </div>

      {/* SEARCH */}
      <input
        placeholder="Search by Order ID"
        className="w-full mb-4 px-4 py-2 rounded-lg border placeholder:text-gray-400 text-gray-900 border-gray-200 bg-white"
      />

      {/* FILTERS */}
      <div className="flex gap-2 mb-6">
        {["All", "Success", "Pending", "Failed"].map((f) => (
          <button
            key={f}
            className="px-4 py-1 rounded-full bg-white/70 text-sm hover:bg-white text-gray-900"
          >
            {f}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="space-y-3">

        {payments.map((p) => {

          const statusColor =
            p.status === "success"
              ? "bg-green-100 text-green-600"
              : p.status === "failed"
              ? "bg-red-100 text-red-600"
              : "bg-yellow-100 text-yellow-600";

          const icon =
            p.status === "success"
              ? "✔️"
              : p.status === "failed"
              ? "❌"
              : "⏳";

          return (
            <div
              key={p._id}
              className="bg-white/70 backdrop-blur-xl rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow transition"
            >

              {/* LEFT */}
              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200">
                  {icon}
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    #{p.orderId}
                  </p>

                  <p className="text-sm text-gray-500">
                    {p.coins} coins •{" "}
                    {new Date(p.createdAt).toDateString()}
                  </p>
                </div>

              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p className="font-semibold text-gray-800">
                  ₹ {p.amount}
                </p>

                <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
                  {p.status === "initiated" ? "Pending" : p.status}
                </span>
              </div>

            </div>
          );
        })}

      </div>

      {/* EMPTY STATE */}
      {payments.length === 0 && (
        <div className="text-center mt-20">
          <img
            src="/images/payment/empty.png"
            className="w-40 mx-auto mb-4"
          />
          <p className="text-lg font-medium text-gray-600">
            No payments yet 💳
          </p>
          <p className="text-sm text-gray-400">
            Buy coins to get started
          </p>

          <button
            onClick={() => (window.location.href = "/buy-coins")}
            className="mt-4 px-6 py-2 rounded-lg bg-indigo-500 text-white"
          >
            Buy Coins
          </button>
        </div>
      )}

    </div>
  </div>
  </ProtectedRoute>
);
}