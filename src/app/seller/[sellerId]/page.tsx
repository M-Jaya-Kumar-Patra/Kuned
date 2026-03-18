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
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Seller Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6 flex items-center gap-6 mb-10">

  <img
    src={seller.avatar || "/images/avatar.png"}
    className="w-20 h-20 rounded-full object-cover border"
  />

  <div className="flex-1">

    <h1 className="text-2xl font-semibold">
      {seller.name}
    </h1>

<p className="text-yellow-500 font-medium">
⭐ {seller.trustScore} Trust Score
</p>
    <p className="text-gray-500 text-sm mt-1">
      Member since {new Date(seller.createdAt).toDateString()}
    </p>

  </div>

  {/* Chat Button */}
  <Link
    href={`/chat?seller=${seller._id}`}
    className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
  >
    Chat Seller
  </Link>

</div>

      {/* Listings Title */}
      <h2 className="text-xl font-semibold mb-6">
        Listings by {seller.name}
      </h2>

      {/* Listings Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {listings.map((item) => (

          <Link
            key={item._id}
            href={`/item/${item.slug}`}
            className="bg-white rounded-xl border hover:shadow-lg transition overflow-hidden"
          >

            <img
              src={item.images[0]}
              className="w-full h-40 object-cover"
            />

            <div className="p-4">

              <p className="text-sm font-medium line-clamp-2 mb-2">
                {item.title}
              </p>

              <p className="text-green-600 font-semibold text-lg">
                ₹{item.price}
              </p>

            </div>

          </Link>

        ))}

      </div>

    </div>
  );
}