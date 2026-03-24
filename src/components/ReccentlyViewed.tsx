"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Listing = {
  _id: string;
  slug: string;
  title: string;
  price: number;
  images: string[];
  location?: string;
};

export default function RecentlyViewed() {
  const [items, setItems] = useState<Listing[]>([]);

  useEffect(() => {
    let ids: string[] = [];

    try {
      const stored = localStorage.getItem("recentlyViewed");
      ids = stored ? JSON.parse(stored) : [];
    } catch {
      ids = [];
    }

    if (!Array.isArray(ids) || ids.length === 0) return;

    const fetchListings = async () => {
      try {
        const res = await api.post("/listings/by-ids", { ids });
        setItems(res.data);
      } catch (err) {
        console.error("Failed to fetch listings", err);
      }
    };

    fetchListings();
  }, []);

  if (!items.length) return null;

  return (
    <div className="max-w-7xl mx-auto mt-12">

      {/* Header */}
      <div className="flex justify-between items-center mb-5 px-1">
        <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
          <span className="text-indigo-500 text-lg">📘</span>
          Recently Viewed
        </h2>

        <button className="flex items-center gap-1 text-indigo-500 text-sm font-medium hover:gap-2 transition-all">
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Container */}
      <div className="
        bg-white/60 backdrop-blur-xl
        rounded-3xl
        p-5
        border border-white/40
        shadow-sm
      ">

        {/* Scroll Row */}
        <div className="flex gap-5 overflow-x-auto scrollbar-hide">

          {items.map((item) => (
            <Link key={item._id} href={`/item/${item.slug}`}>

              <div className="
                min-w-[160px] sm:min-w-[220px]
                bg-white
                rounded-2xl
                p-3
                shadow-sm hover:shadow-md
                transition-all duration-300
                border border-gray-100
              ">

                {/* Image */}
                <img
                  src={item.images?.[0]}
                  alt={item.title}
                  className="w-full h-[100px] sm:h-[120px] object-cover rounded-xl"
                />

                {/* Info */}
                <div className="mt-3">

                  <h3 className="text-sm font-medium text-gray-800 truncate">
                    {item.title}
                  </h3>

                  <p className="text-green-600 font-semibold mt-1">
                    ₹ {item.price}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    📍 {item.location || "Nearby"}
                  </p>

                </div>

              </div>

            </Link>
          ))}

        </div>

      </div>

    </div>
  );
}