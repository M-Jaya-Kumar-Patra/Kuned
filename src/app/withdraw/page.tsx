"use client";

import { useEffect, useState } from "react";

export default function WithdrawPage() {
  const [form, setForm] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    accountHolderName: ""
  });

  const [paidCoins, setPaidCoins] = useState(0);

  // 🔥 fetch user coins
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/user/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setPaidCoins(data.user.paidCoins || 0);
    };

    fetchUser();
  }, []);

  const handleSubmit = async () => {
    const amountNum = Number(form.amount);

    // ❌ invalid amount
    if (!amountNum || amountNum <= 0) {
      alert("Enter a valid amount");
      return;
    }

    // ❌ insufficient coins
    if (amountNum > paidCoins) {
      alert("You don't have enough coins");
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch("/api/withdraw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...form,
        amount: amountNum // 🔥 send number
      })
    });

    const data = await res.json();

    if (data.success) {
      alert("Withdrawal request submitted!");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Withdraw Coins</h1>

      {/* 🔥 show balance */}
      <p className="mb-3 text-sm text-gray-600">
        Available Coins: <strong>{paidCoins}</strong>
      </p>

      <input
        placeholder="Amount"
        onChange={e => setForm({ ...form, amount: e.target.value })}
      />

      <input
        placeholder="Bank Name"
        onChange={e => setForm({ ...form, bankName: e.target.value })}
      />

      <input
        placeholder="Account Number"
        onChange={e => setForm({ ...form, accountNumber: e.target.value })}
      />

      <input
        placeholder="IFSC Code"
        onChange={e => setForm({ ...form, ifsc: e.target.value })}
      />

      <input
        placeholder="Account Holder Name"
        onChange={e => setForm({ ...form, accountHolderName: e.target.value })}
      />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}