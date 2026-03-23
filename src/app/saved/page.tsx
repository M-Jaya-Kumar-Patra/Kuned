"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";


type SavedListing = {
  _id: string;
  listingId: {
    _id: string;
    slug: string;
    title: string;
    price: number;
    images: string[];
  };
};


export default function SavedListings() {
  const [listings, setListings] = useState<SavedListing[]>([]);

  useEffect(() => {
    const fetchSaved = async () => {
      const res = await api.get("/wishlist");
      setListings(res.data);
    };

    fetchSaved();
  }, []);

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#e9ecff] px-4 py-8">

    <div className="max-w-6xl mx-auto">

      {/* HEADER */}
      <h1 className="text-3xl font-semibold text-gray-800">
        Saved Listings 
      </h1>
      <p className="text-gray-500 mb-6">
        Items you liked and saved for later
      </p>

      {/* SEARCH + SORT */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          placeholder="Search saved items..."
          className="flex-1 px-4 py-2 rounded-xl border placeholder:text-gray-400 text-gray-900 border-gray-200 bg-white"
        />

        <select className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 bg-white">
          <option>Recently saved</option>
          <option>Price low to high</option>
          <option>Price high to low</option>
        </select>
      </div>

      {/* GRID */}
      {listings.length === 0 ? (
        <div className="text-center mt-20">
          <img
            src="/images/saved/empty.png"
            className="w-40 mx-auto mb-4"
          />
          <p className="text-lg font-medium text-gray-600">
            No saved listings yet ❤️
          </p>
          <p className="text-sm text-gray-400">
            Start exploring and save items you like
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">

          {listings.map((item) => {

            const listing = item.listingId;

            return (
              <div
                key={item._id}
                className="bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
              >

                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={listing.images[0]}
                    className="w-full h-44 object-cover"
                  />

                
               
                </div>

                {/* CONTENT */}
                <div className="p-4">

                  <h2 className="font-semibold text-gray-800 line-clamp-2">
                    {listing.title}
                  </h2>

                  <p className="text-green-600 font-bold mt-1">
                    ₹ {listing.price}
                  </p>

                  {/* ACTIONS */}
                  <div className="flex items-center justify-between mt-4">

                    <button
                      className="text-sm flex items-center gap-1 text-red-500 bg-red-50 px-3 py-1 rounded-full hover:bg-red-100"
                    >
                      ❤️ Remove
                    </button>

                    <Link
                      href={`/item/${listing.slug}`}
                      className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200"
                    >
                      👁 View
                    </Link>

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  </div>
);
}