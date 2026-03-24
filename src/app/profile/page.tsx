"use client";

import { useContext, useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

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
  views: number;
  messages: number;
};

type Listing = {
  _id: string;
  title: string;
  price: number;
  images: string[];
  status?: "active" | "sold";
  slug: string;
  views?: number; // ✅ ADD THIS
};

type Conversation = {
  unseenCount?: number;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [stats, setStats] = useState({
  listings: 0,
  chats: 0,
  views: 0,
  messages: 0,
});


  const router = useRouter();
  const auth = useContext(AuthContext);

  useEffect(() => {
  if (!auth?.user) {
    router.push("/login");
  }
}, [auth?.user]);

  useEffect(() => {
  const fetchStats = async () => {
    try {
      // Listings (already have API)
      const profileRes = await api.get("/profile");
      const listings = profileRes.data.listings || [];

      // Chats
      const chatRes = await api.get("/chat/conversations");
      const conversations = chatRes.data.conversations || [];

      // 🔥 CALCULATIONS
      const totalViews = listings.reduce(
        (sum: number, l: Listing) => sum + (l.views || 0),
        0
      );

      const totalMessages = conversations.reduce(
        (sum: number, c: Conversation) => sum + (c.unseenCount || 0),
        0
      );

      setStats({
        listings: listings.length,
        chats: conversations.length,
        views: totalViews,
        messages: totalMessages,
      });

    } catch (err) {
      console.error("Stats fetch failed", err);
    }
  };

  fetchStats();
}, []);

  useEffect(() => {
    const loadData = async () => {
      const userRes = await api.get("/user/me");
      setUser(userRes.data.user);

      const statsRes = await api.get("/user/stats");
      setStats(statsRes.data);

      // ✅ ADD THIS
      const listingRes = await api.get("/profile?page=1&limit=5");
      setListings(listingRes.data.listings);
    };

    loadData();
  }, []);

  if (!user) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#e4e7f9] pb-10">
      {/* ===== PROFILE HEADER ===== */}
      <div
        className="relative w-full h-[220px]  px-6 flex items-center justify-between overflow-hidden"
        style={{
          backgroundImage: "url('/images/profile_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0  backdrop-blur-[1px]"></div>

        <div className="w-full max-w-6xl mx-auto px-4 flex items-center justify-between ">
          <div className="relative z-10 flex items-center gap-4">
          {/* AVATAR */}
          <div className="relative group">
            <img
              src={user?.avatar || "/images/default-avatar.png"}
              className="w-36 h-36 rounded-full border-4 border-white shadow object-cover"
            />

            {/* Upload Button */}
            <label className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition">
              Change
              <input
                type="file"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append("avatar", file);

                  const res = await api.put("/user/update-avatar", formData);
                  setUser(res.data);
                }}
              />
            </label>
          </div>

          {/* USER INFO */}
          <div>
            {/* NAME EDIT */}
            {editing ? (
              <div className="flex gap-2 items-center">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-2 py-1 rounded border text-lg placeholder:text-gray-400 text-gray-900"
                />
                <button
                  onClick={async () => {
                    const res = await api.put("/user/update", { name });
                    setUser(res.data);
                    setEditing(false);
                  }}
                  className="bg-black text-white px-3 py-1 rounded text-sm"
                >
                  Save
                </button>
              </div>
            ) : (
              <h2
                className="text-3xl font-semibold text-gray-800 cursor-pointer"
                onClick={() => setEditing(true)}
              >
                {user.name}
              </h2>
            )}

            <p className="text-lg text-gray-600">{user.email}</p>
            <p className="text-lg mt-1 text-black">
              🪙 {user.bonusCoins + user.paidCoins} coins
            </p>
          </div>
        </div>

        {/* EDIT BUTTON */}
        <button
          onClick={() => setEditing(true)}
          className="relative z-10 bg-white/70 backdrop-blur-md text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-white transition"
        >
          ✏️ Edit Profile
        </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 px-4 space-y-6">
        {/* ===== WALLET ===== */}
        <div className="bg-[#f2f2fb] p-6 rounded-2xl shadow">
          <h3 className="font-semibold mb-4 text-xl text-black"> Wallet</h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* TOTAL COINS */}
            <div
              className="relative p-5 rounded-2xl text-white overflow-hidden shadow-lg"
              style={{
                backgroundImage: "url('/images/coin_balance_bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay for better readability */}
              <div className="absolute inset-0 bg-blue-600/30 backdrop-blur-[1px] rounded-2xl"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full justify-between">
                {/* Top Section */}
                <div className="flex justify-between items-start border border-t-0 border-x-0 border-white/30">
                  <p className="text-md opacity-80 font-medium">Total Coins</p>
                  <h2 className="text-3xl font-bold tracking-wide">
                    {user.bonusCoins + user.paidCoins}
                  </h2>
                </div>

                {/* Bottom Section */}
                <div className="flex justify-between items-end mt-4">
                  <div className="text-sm opacity-90 leading-5">
                    <p>
                      Bonus Coins: <b>{user.bonusCoins}</b>
                    </p>
                    <p>
                      Paid Coins: <b>{user.paidCoins}</b>
                    </p>
                  </div>

                  <Link
                    href="/buy-coins"
                    className="bg-white/20 hover:bg-white/30 transition-all text-white px-4 py-1.5 rounded-lg text-sm font-medium backdrop-blur-md border border-white/30 flex items-center gap-1"
                  >
                    Buy Coins{" "}
                    <MdKeyboardArrowRight className="text-lg font-semibold" />
                  </Link>
                </div>
              </div>
            </div>
            {/* WITHDRAW */}
            <div
              className="relative p-5 rounded-2xl text-white overflow-hidden shadow-lg"
              style={{
                backgroundImage: "url('/images/withdrawable_bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-teal-600/30 backdrop-blur-[1px] rounded-2xl"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full justify-between">
                {/* Top Section */}
                <div className="flex justify-between items-start border border-t-0 border-x-0 border-white/30 pb-2">
                  <p className="text-md opacity-80 font-medium">Withdrawable</p>
                  <h2 className="text-3xl font-bold tracking-wide">
                    {user.paidCoins}
                  </h2>
                </div>

                {/* Bottom Section */}
                <div className="flex justify-end items-end mt-4">
                  <Link
                    href="/withdraw"
                    className="bg-white/20 hover:bg-white/30 transition-all text-white px-4 py-1.5 rounded-lg text-sm font-medium backdrop-blur-md border border-white/30 flex items-center gap-1"
                  >
                    Withdraw Funds
                    <MdKeyboardArrowRight className="text-lg font-semibold" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== QUICK ACTIONS ===== */}
        {/* ===== QUICK ACTIONS ===== */}
        <div className="bg-[#eef0f7] p-6 rounded-2xl shadow-inner">
          <h3 className="font-semibold mb-5 flex items-center gap-2 text-gray-700 text-xl">
            ⚡ Quick Actions
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {[
              {
      name: "Buy Coins",
      img: "/images/quickLinks/coins.png",
      path: "/buy-coins",
    },
    {
      name: "Saved Listings",
      img: "/images/quickLinks/heart.png",
      path: "/saved",
    },
    {
      name: "My Listings",
      img: "/images/quickLinks/bar-chart.png",
      path: "/dashboard",
    },
    {
      name: "Payment History",
      img: "/images/quickLinks/credit-card.png",
      path: "/payments",
    },
    {
      name: "Coin History",
      img: "/images/quickLinks/refresh.png",
      path: "/coins",
    },
            ].map((item, i) => (
              <div
                key={i}
                onClick={() => router.push(item.path)}
                className="
          bg-[#f7f8fc]
          rounded-xl
          p-5
          flex flex-col items-center justify-center
          gap-3
          text-center
          border border-[#e6e8f0]
          shadow-[0_4px_12px_rgba(0,0,0,0.05)]
          hover:shadow-[0_6px_18px_rgba(0,0,0,0.08)]
          hover:-translate-y-1
          transition-all
          cursor-pointer
        "
              >
                {/* ICON CONTAINER */}
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-10 h-10 object-contain"
                />

                {/* TEXT */}
                <p className="text-md font-medium text-gray-700">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== STATS ===== */}
        {stats && (
          <div className="bg-[#eef0f7] rounded-2xl shadow-inner p-6">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-semibold text-xl text-gray-700 flex items-center gap-2">
                📊 Activity Overview
              </h3>

              <button className="text-sm text-blue-500 hover:underline">
                View All Listings →
              </button>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
  {
    label: "Listings",
    value: stats.listings,
    img: "/images/activity/bar-chart.png",
  },
  {
    label: "Chats",
    value: stats.chats,
    img: "/images/activity/chat.png",
  },
  {
    label: "Views",
    value: stats.views,
    img: "/images/activity/view.png",
  },
  {
    label: "Messages",
    value: stats.messages,
    img: "/images/activity/notification-bell.png",
  },
].map((item, i) => (
                <div
                  key={i}
                  className="
            bg-[#f7f8fc]
            rounded-xl
            p-4
            flex items-center gap-4
            border border-[#e6e8f0]
            shadow-[0_4px_12px_rgba(0,0,0,0.05)]
            hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)]
            transition-all
          "
                >
                  {/* ICON */}

                  <img
                    src={item.img}
                    alt={item.label}
                    className="w-8 h-8 object-contain"
                  />

                  {/* TEXT */}
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {item.value}
                    </p>
                    <p className="text-sm text-gray-500">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-[#eef0f7] p-6 rounded-2xl shadow-inner">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-semibold text-xl text-gray-700">My Listings</h3>

            <Link
              href="/dashboard"
              className="text-sm text-blue-500 hover:underline"
            >
              View All Listings →
            </Link>
          </div>

          {/* LIST */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 cursor-pointer">
            {listings.slice(0, 3).map((item) => (
              <div
                key={item._id}
                onClick={()=>router.push(`/item/${item?.slug}`)}
                className="
          bg-white
          rounded-xl
          p-3
          flex items-center justify-between
          border border-[#e6e8f0]
          shadow-[0_4px_12px_rgba(0,0,0,0.05)]
        "
              >
                {/* LEFT SIDE */}
                <div className="flex items-center gap-4">
                  {/* IMAGE */}
                  <img
                    src={item.images?.[0] || "/placeholder.png"}
                    className="w-20 h-16 object-cover rounded-lg"
                  />

                  {/* INFO */}
                  <div>
                    <h4 className="font-medium text-gray-800 text-sm">
                      {item.title}
                    </h4>

                    <p className="text-sm font-semibold text-gray-900">
                      ₹{item.price}
                    </p>

                    {/* STATUS */}
                    <div className="mt-1">
                      {item.status === "sold" ? (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                          Sold
                        </span>
                      ) : (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                          ● Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <Link
                  href={`/edit/${item._id}`}
                  className="bg-white shadow-md text-gray-700 hover:bg-gray-200 px-4 py-1.5 rounded-lg text-sm"
                >
                  Manage
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ===== REFERRAL ===== */}
        <div className="bg-[#eef0f7] p-6 rounded-2xl shadow-inner">
          <div className="flex justify-between items-center">
            {/* HEADER */}
            <h3 className="font-semibold mb-2 text-xl text-gray-700 flex items-center gap-2">
              🎁 Invite & Earn
            </h3>

            {/* FOOTER STATS */}
            <div className="hidden sm:block text-sm text-gray-500 flex gap-3">
              <span>
                Referrals <b className="text-gray-700">12</b>
              </span>
              <span>|</span>
              <span>
                Coins Earned <b className="text-gray-700">120</b>
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Earn 10 coins for each friend who joins Kuned!
          </p>

          {/* LINK BOX */}
          <div className="flex items-center bg-white border border-[#e6e8f0] rounded-lg overflow-hidden">
            {/* LINK */}
            <div className="flex-1 px-3 py-2 text-sm text-gray-600 truncate">
              {process.env.NEXT_PUBLIC_SITE_URL}/ref/{user.referralCode}
            </div>

            {/* COPY BUTTON */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${process.env.NEXT_PUBLIC_SITE_URL}/ref/${user.referralCode}`,
                );

                setCopied(true);

                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
              className={`
    px-4 py-2 text-sm border-l border-[#e6e8f0]
    transition-all duration-200
    ${
      copied
        ? "bg-green-100 text-green-600 scale-105"
        : "bg-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-200"
    }
  `}
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>

          {/* SHARE BUTTON */}
          <button
            onClick={() => {
              navigator.share?.({
                title: "Join Kuned",
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/ref/${user.referralCode}`,
              });
            }}
            className="mt-4 w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            🔗 Share Invite
          </button>

          {/* FOOTER STATS */}
          <div className="block sm:hidden mt-4 text-sm text-gray-500 border-t pt-3 flex gap-3">
            <span>
              Referrals <b className="text-gray-700">12</b>
            </span>
            <span>|</span>
            <span>
              Coins Earned <b className="text-gray-700">120</b>
            </span>
          </div>
        </div>

        {/* ===== PASSWORD ===== */}
        <div className="bg-[#eef0f7] p-6 rounded-2xl shadow-inner">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700 text-xl">🔒 Security</h3>

            <button
              onClick={() => setShowPassword(!showPassword)}
              className="bg-white border border-[#e6e8f0] px-4 py-1.5 rounded-lg text-sm hover:bg-gray-100 transition text-gray-600"
            >
              {showPassword ? "Close" : "Change Password"}
            </button>
          </div>

          {/* EXPANDABLE FORM */}
          <div
            className={`
      overflow-hidden transition-all duration-300
      ${showPassword ? "max-h-[300px] mt-5" : "max-h-0"}
    `}
          >
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full px-3 py-2 rounded-lg border border-[#e6e8f0] bg-white focus:outline-none text-black placeholder:text-gray-400"
              />

              <input
                type="password"
                placeholder="New Password"
                className="w-full px-3 py-2 rounded-lg border border-[#e6e8f0] bg-white focus:outline-none text-black placeholder:text-gray-400"
              />

              <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition">
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
