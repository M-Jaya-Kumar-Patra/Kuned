"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";

type User = {
  name: string;
  email: string;
  avatar?: string;
  bonusCoins: number;
  paidCoins: number;
  referralCode: string;
  banned: boolean;
};

type Stats = {
  listings: number;
  chats: number;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");

  useEffect(() => {
    const loadData = async () => {
      const userRes = await api.get("/user/me");
      setUser(userRes.data.user);

      const statsRes = await api.get("/user/stats");
      setStats(statsRes.data);
    };

    loadData();
  }, []);

  

  if (!user) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

        {/* LEFT PANEL */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">

          <img
            src={user.avatar || "/default-avatar.png"}
            className="w-24 h-24 rounded-full object-cover border"
          />

          {/* NAME */}
          {editing ? (
            <div className="flex gap-2 mt-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <button
                onClick={async () => {
                  const res = await api.put("/user/update", { name });
                  setUser(res.data);
                  setEditing(false);
                }}
                className="bg-black text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          ) : (
            <h2
              className="text-xl font-semibold mt-4 cursor-pointer"
              onClick={() => setEditing(true)}
            >
              {user.name}
            </h2>
          )}

          <p className="text-gray-500 text-sm">{user.email}</p>

          {user.banned && (
            <span className="mt-2 text-xs bg-red-500 text-white px-2 py-1 rounded">
              Account Banned
            </span>
          )}

          {/* ACTION BUTTONS */}
          <div className="w-full mt-6 space-y-2">
            <Link href="/buy-coins" className="block w-full text-center bg-black text-white py-2 rounded-lg">
              Buy Coins
            </Link>

            <Link href="/withdraw" className="block w-full text-center border py-2 rounded-lg hover:bg-gray-50">
              Withdraw
            </Link>

            <Link href="/payments" className="block w-full text-center border py-2 rounded-lg hover:bg-gray-50">
              Payment History
            </Link>

            <Link href="/saved" className="block w-full text-center border py-2 rounded-lg hover:bg-gray-50">
              Saved Listings ❤️
            </Link>

            <Link href="/coins" className="block w-full text-center border py-2 rounded-lg hover:bg-gray-50">
              Coin History
            </Link>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="md:col-span-2 space-y-6">

          {/* STATS */}
          {stats && (
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow text-center">
                <p className="text-2xl font-bold">{stats.listings}</p>
                <p className="text-gray-500 text-sm">Listings</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow text-center">
                <p className="text-2xl font-bold">{stats.chats}</p>
                <p className="text-gray-500 text-sm">Chats</p>
              </div>
            </div>
          )}

          {/* COINS */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold mb-4">Wallet</h3>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <p className="text-xl font-bold text-blue-600">
                  {user.bonusCoins}
                </p>
                <p className="text-sm text-gray-500">Bonus Coins</p>
              </div>

              <div className="bg-green-50 p-4 rounded-xl text-center">
                <p className="text-xl font-bold text-green-600">
                  {user.paidCoins}
                </p>
                <p className="text-sm text-gray-500">Paid Coins</p>
              </div>
            </div>
          </div>

          {/* REFERRAL */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold mb-3">Invite Friends</h3>

            <div className="bg-gray-50 p-3 rounded-lg text-sm break-all">
              {process.env.NEXT_PUBLIC_SITE_URL}/signup?ref={user.referralCode}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${process.env.NEXT_PUBLIC_SITE_URL}/signup?ref=${user.referralCode}`
                  );
                  alert("Copied!");
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
              >
                Copy
              </button>

              <button
                onClick={() => {
                  navigator.share?.({
                    title: "Kuned",
                    url: `${process.env.NEXT_PUBLIC_SITE_URL}/signup?ref=${user.referralCode}`,
                  });
                }}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg"
              >
                Share
              </button>
            </div>
          </div>

          {/* PASSWORD */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold mb-4">Change Password</h3>

            <input
              type="password"
              placeholder="Current Password"
              className="border p-2 w-full mb-3 rounded"
            />

            <input
              type="password"
              placeholder="New Password"
              className="border p-2 w-full mb-3 rounded"
            />

            <button className="bg-black text-white px-4 py-2 rounded w-full">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}