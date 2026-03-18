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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Saved Listings
      </h1>

      <div className="grid grid-cols-3 gap-4">
        {listings.map((item) => (
          <Link
            key={item._id}
            href={`/item/${item.listingId.slug}`}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={item.listingId.images[0]}
              className="w-full h-40 object-cover"
            />

            <div className="p-3">
              <h2 className="font-semibold">
                {item.listingId.title}
              </h2>

              <p className="text-green-600 font-medium">
                ₹{item.listingId.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}