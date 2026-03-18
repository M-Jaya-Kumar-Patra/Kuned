"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";


type CoinTransaction = {
  _id: string;
  amount: number;
  coinType: "bonus" | "paid";
  transactionType: "earn" | "spend";
  source: string;
  createdAt: string;
};


export default function CoinHistoryPage() {

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

  if (loading) {
    return <p className="p-6">Loading coin history...</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Coin History
      </h1>

      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        transactions.map((t) => (

          <div key={t._id} className="border p-3 mb-2 rounded">

            <p className="font-semibold">
              {t.source}
            </p>

            <p>
              {t.transactionType === "earn" ? "+" : "-"}
              {t.amount} coins
            </p>

          </div>

        ))
      )}

    </div>
  );
}