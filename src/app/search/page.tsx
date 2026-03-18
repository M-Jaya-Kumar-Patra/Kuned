"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import ListingCard from "@/components/ListingCard";

type Listing = {
  _id: string;
  title: string;
  price: number;
  slug: string;
  images: string[];
  location: string;
  category: string;
};

export default function SearchPage() {

  const [listings, setListings] = useState<Listing[]>([]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const searchListings = async () => {

    try {

      const res = await api.get("/listings", {
        params: {
          keyword,
          location,
          category,
          minPrice,
          maxPrice
        }
      });
      
      setListings(Array.isArray(res.data.listings) ? res.data.listings : []);

    } catch (error) {

      console.error("Search failed", error);

    }

  };

  // Initial load
  useEffect(() => {

    const fetchInitialListings = async () => {

      try {

        const res = await api.get("/listings");

        setListings(Array.isArray(res.data.listings) ? res.data.listings : []);

      } catch (error) {

        console.error("Failed to fetch listings", error);

      }

    };

    fetchInitialListings();

  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Search Listings
      </h1>

      {/* Filters */}

      <div className="grid grid-cols-5 gap-3 mb-6">

        <input
          placeholder="Search keyword"
          className="border p-2"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <input
          placeholder="Location"
          className="border p-2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="number"
          placeholder="Min Price"
          className="border p-2"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Price"
          className="border p-2"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <select
          className="border p-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Books">Books</option>
          <option value="Cycles">Cycles</option>
          <option value="Hostel Items">Hostel Items</option>
        </select>

      </div>

      <button
        onClick={searchListings}
        className="bg-black text-white px-4 py-2 mb-6"
      >
        Search
      </button>

      {/* Listings */}

      <div className="grid grid-cols-4 gap-6">

        {listings.length === 0 && (
          <p>No listings found</p>
        )}

        {listings?.map((item) => (
          <ListingCard key={item._id} item={item} />
        ))}

      </div>

    </div>
  );
}