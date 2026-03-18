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
      const res = await api.post("/listings/by-ids", {
        ids,
      });

      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch listings", err);
    }
  };

  fetchListings();
}, []);
  if (!items.length) return null;

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h2 className="text-xl font-semibold mb-4">
        Recently Viewed
      </h2>

      <div className="grid grid-cols-4 gap-4">
        {items.map((item) => (
          <Link
            key={item._id}
            href={`/item/${item.slug}`}
            className="border rounded-lg overflow-hidden hover:shadow"
          >
            <img
              src={item.images[0]}
              className="w-full h-32 object-cover"
            />

            <div className="p-2">
              <p className="text-sm font-medium">
                {item.title}
              </p>

              <p className="text-green-600">
                ₹{item.price}
              </p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}