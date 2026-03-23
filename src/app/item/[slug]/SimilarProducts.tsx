"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";

type Listing = {
  _id: string;
  title: string;
  price: number;
  images: string[];
  slug: string;
};

export default function SimilarProducts({ listingId }: { listingId: string }) {

  const [similarListings, setSimilarListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const res = await api.get(`/listings/similar/${listingId}`);
        setSimilarListings(res.data);
      } catch (err) {
        console.error("Failed to fetch similar listings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [listingId]);

  if (loading) return null;
  if (similarListings.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* TITLE */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Similar Products
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {similarListings.map((item) => (

          <Link
            key={item._id}
            href={`/item/${item.slug}`}
            className="group bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
          >

            {/* IMAGE */}
            <div className="overflow-hidden">
              <img
                src={item.images?.[0]}
                className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
              />
            </div>

            {/* CONTENT */}
            <div className="p-3">

              <p className="font-medium text-gray-800 line-clamp-1 group-hover:text-indigo-600 transition">
                {item.title}
              </p>

              <p className="text-green-600 font-semibold mt-1">
                ₹{item.price}
              </p>

            </div>

          </Link>

        ))}

      </div>

    </div>
  );
}