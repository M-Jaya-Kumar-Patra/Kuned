"use client";

import { useEffect, useState } from "react";

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
      const token = localStorage.getItem("token");

      const res = await fetch("/api/payments/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setPayments(data.payments || []);
    };

    fetchPayments();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Order ID</th>
              <th className="p-3 border">Amount (₹)</th>
              <th className="p-3 border">Coins</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="text-center">
                <td className="p-3 border">{p.orderId}</td>
                <td className="p-3 border">₹{p.amount}</td>
                <td className="p-3 border">{p.coins}</td>

                <td className="p-3 border">
                  {p.status === "success" && (
                    <span className="text-green-600 font-semibold">
                      Success
                    </span>
                  )}
                  {p.status === "failed" && (
                    <span className="text-red-600 font-semibold">
                      Failed
                    </span>
                  )}
                  {p.status === "initiated" && (
                    <span className="text-yellow-600 font-semibold">
                      Pending
                    </span>
                  )}
                </td>

                <td className="p-3 border">
                  {new Date(p.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {payments.length === 0 && (
          <p className="text-center mt-6 text-gray-500">
            No payments found
          </p>
        )}
      </div>
    </div>
  );
}