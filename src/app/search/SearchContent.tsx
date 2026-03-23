"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useSearchParams } from "next/navigation";

type Listing = {
  _id: string;
  title: string;
  price: number;
  slug: string;
  images: string[];
  location: string;
  category: string;
};

export default function SearchContent() {
  const searchParams = useSearchParams();

  const [listings, setListings] = useState<Listing[]>([]);
  const [keyword, setKeyword] = useState(
    () => searchParams.get("keyword") || ""
  );
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // ✅ FETCH LISTINGS
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get("/listings", {
          params: { keyword, location, category, minPrice, maxPrice },
        });

        setListings(res.data.listings || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchListings();
  }, [keyword, location, category, minPrice, maxPrice]);

  // ✅ CLEAR FILTERS
  const clearFilters = () => {
    setLocation("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* 🔍 SEARCH BAR */}
        <div className="bg-white/70 backdrop-blur-xl p-4 rounded-2xl shadow-sm flex gap-3 mb-8 border border-white/40">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search for items..."
            className="flex-1 px-4 py-3 rounded-xl bg-white border outline-none text-gray-800"
          />

          <button className="bg-indigo-500 hover:bg-indigo-600 transition text-white px-6 rounded-xl">
            Search
          </button>
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">
            Showing {listings.length} results
          </h2>

          <select className="px-4 py-2 rounded-xl bg-white border text-gray-600">
            <option>Latest</option>
            <option>Price Low to High</option>
            <option>Price High to Low</option>
          </select>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-12 gap-8">

          {/* 🧊 SIDEBAR */}
          <div className="col-span-3">
            <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl shadow-sm border border-white/40 space-y-6">

              <h3 className="font-semibold text-gray-700">Filters</h3>

              {/* Location */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Location</p>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full px-3 py-2 rounded-lg border bg-white"
                />
              </div>

              {/* Price */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Price Range</p>

                <div className="flex gap-2">
                  <input
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-full px-2 py-1 border rounded"
                  />

                  <input
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-full px-2 py-1 border rounded"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Category</p>

                {[
                  "Electronics",
                  "Furniture",
                  "Books",
                  "Cycles",
                  "Hostel Items",
                ].map((cat) => (
                  <label key={cat} className="flex gap-2 text-sm text-gray-600">
                    <input
                      type="radio"
                      checked={category === cat}
                      onChange={() => setCategory(cat)}
                    />
                    {cat}
                  </label>
                ))}
              </div>

              {/* Clear */}
              <button
                onClick={clearFilters}
                className="text-red-500 text-sm hover:underline"
              >
                Clear Filters
              </button>

            </div>
          </div>

          {/* 🧾 LISTINGS */}
          <div className="col-span-9">

            {listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                {listings.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl p-3 shadow-sm border border-white/40 hover:shadow-md hover:-translate-y-1 transition-all"
                  >
                    <img
                      src={item.images[0]}
                      className="w-full h-40 object-cover rounded-xl"
                    />

                    <h3 className="mt-3 font-medium text-gray-800 text-sm">
                      {item.title}
                    </h3>

                    <p className="text-green-600 font-semibold mt-1">
                      ₹{item.price}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      📍 {item.location}
                    </p>
                  </div>
                ))}

              </div>
            ) : (
              <div className="bg-white/70 p-10 rounded-2xl text-center">
                <p className="text-gray-600">No results found</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}