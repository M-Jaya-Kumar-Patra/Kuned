"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

// Components (you will design later)
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedListings from "@/components/home/FeaturedListings";
import DealsSection from "@/components/home/DealsSection";
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

      topListings.sort(() => Math.random() - 0.5);
      urgentListings.sort(() => Math.random() - 0.5);

      setListings([
        ...topListings,
        ...urgentListings,
        ...highlightListings,
        ...normalListings,
      ]);
    };

    fetchListings();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO */}
      <HeroSection />

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* CATEGORIES */}
        <CategorySection />

        {/* FEATURED */}
        <FeaturedListings listings={listings} />

        {/* DEALS (Urgent + Latest side by side) */}
        <DealsSection listings={listings} />

      </div>

      {/* RECENT */}
      <RecentlyViewed />
    </div>
  );
}