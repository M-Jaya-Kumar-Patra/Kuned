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

    <div className="max-w-6xl mx-auto p-6">

      <h2 className="text-2xl font-semibold mb-6">
        Similar Products
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

        {similarListings.map((item) => (

          <Link
            key={item._id}
            href={`/item/${item.slug}`}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition"
          >

            <img
              src={item.images?.[0]}
              className="w-full h-40 object-cover"
            />

            <div className="p-3">

              <p className="font-medium line-clamp-1">
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