"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

// Components (you will design later)
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedListings from "@/components/home/FeaturedListings";
import DealsSection from "@/components/home/DealsSection";
import RecentlyViewed from "@/components/ReccentlyViewed";
import Footer from "@/components/Footer";
import SellCTA from "@/components/home/SellCTA";

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
  status: "sold" | "active";
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
  <div className="relative min-h-screen overflow-hidden 
    bg-gradient-to-br from-[#f5f7fb] via-[#eef2ff] to-[#f9fafb]">

    {/* 🔵 Top Right Glow */}
    <div
      className="absolute top-[-150px] right-[-150px] w-[500px] h-[500px]
      bg-blue-400 opacity-20 blur-[120px] rounded-full"
    />

    {/* 🟣 Bottom Left Glow */}
    <div
      className="absolute bottom-[-150px] left-[-150px] w-[400px] h-[400px]
      bg-purple-300 opacity-20 blur-[120px] rounded-full"
    />

    {/* CONTENT */}
    <div className="relative z-10">

      {/* HERO */}
      <HeroSection />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 lg:px-6 pt-6 pb-10 space-y-10">

        {/* CATEGORIES */}
        <CategorySection />

        {/* FEATURED */}
        <FeaturedListings listings={listings} />

        {/* DEALS */}
        <DealsSection listings={listings} />

        <SellCTA/>

      <RecentlyViewed />
      </div>

    </div>
  </div>
);
}