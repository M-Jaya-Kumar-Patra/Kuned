"use client";

import { ArrowRight } from "lucide-react";
import type { Listing } from "@/types/listing";

type Props = {
  listings: Listing[];
};

export default function FeaturedListings({ listings }: Props) {

  const featured = listings.slice(0, 10);

  return (
    <div className="mt-12">

      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
          <span className="text-yellow-400 text-xl">⭐</span>
          Featured Listings
        </h2>

        <button className="flex items-center gap-1 text-indigo-500 text-sm font-medium hover:gap-2 transition-all">
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Parent Container */}
      <div className="
        bg-white/60 backdrop-blur-xl
        rounded-3xl
        p-6
        border border-white/40
        shadow-sm
      ">

        {/* Horizontal Scroll */}
        <div className="flex gap-5 overflow-x-auto scrollbar-hide">

          {featured.map((item) => (
            <div
              key={item._id}
              className="
                min-w-[220px]
                bg-white
                rounded-2xl
                shadow-sm hover:shadow-md
                transition-all duration-300
                overflow-hidden
                border border-gray-100
              "
            >

              {/* Image */}
              <div className="relative">

                <img
                  src={item.images?.[0]}
                  alt={item.title}
                  className="w-full h-[150px] object-cover"
                />

                {/* ✅ REAL BADGES (DATA-DRIVEN) */}

                {item.urgentSale && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                    URGENT
                  </span>
                )}

                {item.topListing && (
                  <span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-md font-medium">
                    TOP
                  </span>
                )}

                {item.isHighlighted && (
                  <span className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                    HIGHLIGHT
                  </span>
                )}

                {item.status === "sold" && (
                  <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-semibold">
                    SOLD
                  </span>
                )}

              </div>

              {/* Content */}
              <div className="p-3">

                <h3 className="text-sm font-medium text-gray-800 truncate">
                  {item.title}
                </h3>

                <p className="text-indigo-600 font-semibold mt-1">
                  ₹ {item.price}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  📍 {item.location}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}