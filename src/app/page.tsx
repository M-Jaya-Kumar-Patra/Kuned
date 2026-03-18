"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import ListingCard from "@/components/ListingCard";
import Navbar from "@/components/Navbar";
import RecentlyViewed from "@/components/ReccentlyViewed";

type Listing = {
  _id: string;
  title: string;
  price: number;
  location: string;
  slug: string;
  images: string[];

  topListing?: boolean;
  urgentSale?: boolean;
  isHighlighted?: boolean;
};

export default function HomePage() {

  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {

    const fetchListings = async () => {

      const res = await api.get("/listings");
      const data: Listing[] = res.data.listings;

      const topListings = data.filter((l) => l.topListing);
      const urgentListings = data.filter((l) => !l.topListing && l.urgentSale);
      const highlightListings = data.filter(
        (l) => !l.topListing && !l.urgentSale && l.isHighlighted
      );
      const normalListings = data.filter(
        (l) => !l.topListing && !l.urgentSale && !l.isHighlighted
      );

      // Randomize top and urgent
      topListings.sort(() => Math.random() - 0.5);
      urgentListings.sort(() => Math.random() - 0.5);

      const finalListings = [
        ...topListings,
        ...urgentListings,
        ...highlightListings,
        ...normalListings
      ];

      setListings(finalListings);
    };

    fetchListings();

  }, []);

  return (
    <div>

      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-2xl font-bold mb-4">
          Latest Listings
        </h1>

        <div className="grid grid-cols-4 gap-6">

          {listings.map((item) => (
            <ListingCard key={item._id} item={item} />
          ))}


        </div>

      </div>
          <RecentlyViewed />

    </div>
  );
}