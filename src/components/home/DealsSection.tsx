"use client";

import { ArrowRight } from "lucide-react";
import type { Listing } from "@/types/listing";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type Props = {
  listings: Listing[];
};

export default function DealsSection({ listings }: Props) {
  const auth = useContext(AuthContext);
  const router = useRouter();
const user = auth?.user;

const coins = (user?.bonusCoins ?? 0) + (user?.paidCoins ?? 0);


  const allUrgent = listings.filter(
  (l) => l.urgentSale && l.status !== "sold"
);

const allLatest = listings.filter(
  (l) => l.status !== "sold"
);

// 👇 CORE LOGIC
const urgent = allUrgent.length < 6
  ? allUrgent.slice(0, 3)
  : allUrgent.slice(0, 6);

const latest = allLatest.length < 6
  ? allLatest.slice(0, 3)
  : allLatest.slice(0, 6);

  const isUrgentTwoRows = urgent.length > 3;
const isLatestTwoRows = latest.length > 3;

  return (
    <div className="grid grid-cols-2 gap-6 mt-12">
      {/* 🔴 URGENT DEALS */}
      <div
        className="
        bg-red-50/70
        rounded-3xl
        p-6
        border border-red-100
        shadow-sm
      "
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
            <span className="text-red-500 text-lg">🚨</span>
            Urgent Deals
          </h2>

          <button 
        onClick={()=>router.push("/search?keyword=&location=")}
          
          className="flex items-center gap-1 cursor-pointer text-indigo-500 text-sm font-medium hover:gap-2 transition-all">
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Cards */}
        <div
          className={`grid grid-cols-3 ${isUrgentTwoRows ? "gap-3" : "gap-5"}`}
        >
          {urgent.map((item) => (
            <Link key={item._id} href={`/item/${item.slug}`}>
              <div className="bg-white rounded-xl p-2 shadow-sm hover:shadow-md transition-all border border-gray-100">
                <img
                  src={item.images?.[0]}
                  alt={item.title}
                  className={`
            w-full object-cover rounded-md
            ${isUrgentTwoRows ? "h-32" : "h-36"}
          `}
                />

                <div className="mt-2">
                  <h3 className="text-xs font-medium text-gray-800 truncate">
                    {item.title}
                  </h3>

                  <p className="text-indigo-600 font-semibold text-sm">
                    ₹ {item.price}
                  </p>

                  <p className="text-[11px] text-gray-500">
                    📍 {item.location}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 🟢 LATEST LISTINGS  &  use coins*/}
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Latest Listings
          </h2>

          <button
        onClick={()=>router.push("/search?keyword=&location=")}
           className="flex items-center gap-1 cursor-pointer text-indigo-500 text-sm font-medium hover:gap-2 transition-all">
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Cards */}
        <div
  className={`
    grid grid-cols-3
    ${isLatestTwoRows ? "grid-rows-2 gap-3" : "grid-rows-1 gap-5"}
    auto-rows-fr
  `}
>
          {latest.map((item) => (
            <Link key={item._id} href={`/item/${item.slug}`}>
              <div className="bg-white rounded-xl p-2 shadow-sm hover:shadow-md transition-all border border-gray-100">
                <div className="relative">
                  <img
                    src={item.images?.[0]}
                    alt={item.title}
                    className={`
              w-full object-cover rounded-md
              ${isLatestTwoRows ? "h-28" : "h-28"}
            `}
                  />

                  {item.topListing && (
                    <span className="absolute top-1 right-1 bg-yellow-400 text-black text-[10px] px-2 py-[2px] rounded">
                      TOP
                    </span>
                  )}
                </div>

                <div className="mt-2">
                  <h3 className="text-xs font-medium text-gray-800 truncate">
                    {item.title}
                  </h3>

                  <p className="text-indigo-600 font-semibold text-sm">
                    ₹ {item.price}
                  </p>

                  <p className="text-[11px] text-gray-500">
                    📍 {item.location}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Coins Box */}
     <div
        onClick={()=>router.push("/create")}
     
  className="
    mt-6
    bg-white/70 backdrop-blur-md
    border border-gray-200
    rounded-2xl
    p-4
    flex items-center gap-4
    shadow-sm
    cursor-pointer
  "
>
  {/* Icon */}
  <img
    src="/images/wallet.png"
    alt="wallet"
    className="w-8 h-8 object-contain"
  />

  {/* Text */}
  <p className="text-md text-gray-700">
    You have{" "}
    <span className="font-semibold text-black">
      {coins}
    </span>{" "}
    coins{" "}
    <span className="text-gray-500">
      — Use them to boost your listings 🚀
    </span>
  </p>
</div>
      </div>
    </div>
  );
}
