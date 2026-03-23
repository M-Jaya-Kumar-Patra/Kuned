"use client";

import { useEffect, useState } from "react";

export default function WithdrawPage() {
  const [form, setForm] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    accountHolderName: "",
  });

  const [paidCoins, setPaidCoins] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setPaidCoins(data.user.paidCoins || 0);
    };

    fetchUser();
  }, []);

  const handleSubmit = async () => {
    const amountNum = Number(form.amount);

    if (!amountNum || amountNum <= 0) {
      alert("Enter a valid amount");
      return;
    }

    if (amountNum > paidCoins) {
      alert("You don't have enough coins");
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch("/api/withdraw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        amount: amountNum,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Withdrawal request submitted!");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#e9ecff] flex items-center justify-center px-4">

      <div className="w-full max-w-lg bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">

        {/* HEADER */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">
          Withdraw Funds 💸
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Transfer your earnings to your bank account
        </p>

        {/* BALANCE CARD */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-4 rounded-2xl mb-6 shadow">
          <p className="text-sm opacity-80">Available Balance</p>
          <h2 className="text-3xl font-bold mt-1">{paidCoins} coins</h2>
        </div>

        {/* FORM */}
        <div className="space-y-4">

          <input
            placeholder="Amount"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white/80 text-gray-900 outline-none"
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />

          <input
            placeholder="Bank Name"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white/80 text-gray-900 outline-none"
            onChange={(e) =>
              setForm({ ...form, bankName: e.target.value })
            }
          />

          <input
            placeholder="Account Number"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white/80 text-gray-900 outline-none"
            onChange={(e) =>
              setForm({ ...form, accountNumber: e.target.value })
            }
          />

          <input
            placeholder="IFSC Code"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white/80 text-gray-900 outline-none"
            onChange={(e) =>
              setForm({ ...form, ifsc: e.target.value })
            }
          />

          <input
            placeholder="Account Holder Name"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white/80 text-gray-900 outline-none"
            onChange={(e) =>
              setForm({ ...form, accountHolderName: e.target.value })
            }
          />

        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium hover:opacity-90 transition"
        >
          Submit Withdrawal
        </button>

      </div>
    </div>
  );
}