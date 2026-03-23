"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";

type Listing = {
  _id: string;
  slug: string;
  title: string;
  price: number;
  images: string[];
};

type Seller = {
  _id: string;
  name: string;
  avatar?: string;
  createdAt: string;
  trustScore: number;
};

export default function SellerPage({
  params
}: {
  params: Promise<{ sellerId: string }>;
}) {

  const [seller, setSeller] = useState<Seller | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {

    const fetchSeller = async () => {

      const { sellerId } = await params;

      const res = await api.get(`/seller/${sellerId}`);

      setSeller(res.data.user);
      setListings(res.data.listings);

    };

    fetchSeller();

  }, [params]);

  if (!seller) return <p className="p-10 text-center">Loading seller...</p>;

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#e9ecff] px-4 py-8">

    <div className="max-w-6xl mx-auto">

      {/* PROFILE HEADER */}
      <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow overflow-hidden mb-10">

        {/* Cover */}
        <div className="h-40 bg-gradient-to-r from-indigo-400 to-blue-400 opacity-70" />

        {/* Avatar */}
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2">
          <img
            src={seller.avatar || "/images/avatar.png"}
            className="w-24 h-24 rounded-full border-4 border-white object-cover shadow"
          />
        </div>

        {/* Info */}
        <div className="pt-16 pb-6 text-center">

          <h1 className="text-2xl font-semibold text-gray-800">
            {seller.name}
          </h1>

          <p className="text-yellow-500 mt-1 font-medium">
            ⭐ {seller.trustScore} Trust Score
          </p>

          <p className="text-gray-500 text-sm mt-1">
            Joined in {new Date(seller.createdAt).toLocaleDateString()}
          </p>

          {/* ACTIONS */}
          <div className="flex justify-center gap-3 mt-4">

            <Link
              href={`/chat?seller=${seller._id}`}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
            >
              💬 Chat with Seller
            </Link>

            <button
              onClick={() => window.location.href = `/report?listing=${seller._id}`}
              className="text-sm text-gray-500 underline"
            >
              Report Seller
            </button>

          </div>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 border-t text-center">

          <div className="p-4">
            <p className="font-semibold text-gray-800">
              {listings.length}
            </p>
            <p className="text-xs text-gray-500">
              Listings
            </p>
          </div>

          <div className="p-4 border-x">
            <p className="font-semibold text-gray-800">
              {seller.trustScore}
            </p>
            <p className="text-xs text-gray-500">
              Trust Score
            </p>
          </div>

          <div className="p-4">
            <p className="font-semibold text-gray-800">
              {new Date(seller.createdAt).getFullYear()}
            </p>
            <p className="text-xs text-gray-500">
              Member Since
            </p>
          </div>

        </div>

      </div>

      {/* LISTINGS HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl font-semibold text-gray-800">
          Listings by {seller.name}
        </h2>

        <select className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
          <option>Latest</option>
          <option>Price low-high</option>
          <option>Price high-low</option>
        </select>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {listings.map((item) => (
          <Link
            key={item._id}
            href={`/item/${item.slug}`}
            className="bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
          >

            {/* IMAGE */}
            <div className="relative">
              <img
                src={item.images[0]}
                className="w-full h-44 object-cover"
              />

              {/* Example badges */}
              <span className="absolute top-2 left-2 text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">
                TOP LISTING
              </span>

            </div>

            {/* CONTENT */}
            <div className="p-4">

              <p className="font-medium text-gray-800 line-clamp-2 mb-2">
                {item.title}
              </p>

              <p className="text-green-600 font-bold text-lg">
                ₹ {item.price}
              </p>

            </div>

          </Link>
        ))}

      </div>

    </div>
  </div>
);
}