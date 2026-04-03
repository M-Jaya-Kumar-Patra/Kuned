"use client";

import {  useEffect, useState } from "react";
import api from "@/services/api";
import {  useSearchParams } from "next/navigation";
import Link from "next/link";

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
  const [sort, setSort] = useState("");

  const [showFilterModal, setShowFilterModal] = useState(false);



  useEffect(() => {
  if (showFilterModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [showFilterModal]);
  // ✅ FETCH LISTINGS
  useEffect(() => {
  const fetchListings = async () => {
    try {
      const res = await api.get("/listings", {
        params: { keyword, location, category, minPrice, maxPrice },
      });

      const data: Listing[] = res.data.listings || [];

      // ✅ SORT LOGIC
      if (sort === "low") {
        data.sort((a, b) => a.price - b.price);
      } else if (sort === "high") {
        data.sort((a, b) => b.price - a.price);
      }

      setListings(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchListings();
}, [keyword, location, category, minPrice, maxPrice, sort]);


  // ✅ CLEAR FILTERS
  const clearFilters = () => {
    setLocation("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto sm:px-6  sm:py-8">

        {/* 🔍 SEARCH BAR */}
        <div className="bg-white/70 backdrop-blur-xl p-3 sm:p-4 mb-5 sm:mb-8 rounded-2xl shadow-sm flex flex-row gap-2 sm:gap-3  border border-white/40">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search for items..."
            className="flex-1 px-4 py-3 rounded-xl bg-white border outline-none text-gray-800"
          />

          <button className="bg-indigo-500 hover:bg-indigo-600 transition text-white px-2 sm:px-6 rounded-xl">
            Search
          </button>
        </div>

        {/* HEADER */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">

  {/* LEFT: Results */}
  <h2 className="ihdden sm:block text-base sm:text-lg font-semibold text-gray-700">
    Showing <span className="text-gray-900">{listings.length}</span> results
  </h2>

  {/* RIGHT: Actions */}
  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">

    {/* Sort */}
    <select
  value={sort}
  onChange={(e) => setSort(e.target.value)}
  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-white border text-gray-600 text-sm"
>
  <option value="">Latest</option>
  <option value="low">Price Low to High</option>
  <option value="high">Price High to Low</option>
</select>

    {/* Filter Button (mobile only) */}
    <button
      onClick={() => setShowFilterModal(true)}
      className="lg:hidden px-3 sm:px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm whitespace-nowrap"
    >
      Filters ⚙️
    </button>

  </div>
</div>

     

        {/* MAIN GRID */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6">

          {/* 🧊 SIDEBAR */}
          <div className="hidden lg:block col-span-3">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-white/40 p-4 sm:p-5 space-y-5 sm:space-y-6">

              <h3 className="font-semibold text-gray-700">Filters</h3>

              {/* Location */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Location</p>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full px-3 py-2 rounded-lg border bg-white placeholder:text-gray-400 text-gray-900"
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
                    className="w-full px-2 py-1 border rounded  placeholder:text-gray-400 text-gray-900"
                  />

                  <input
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-full px-2 py-1 border rounded  placeholder:text-gray-400 text-gray-900"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Category</p>

                {[
                  "Electronics",
                  "Furniture",
                  "Fashion",
                  "Books",
                  "Vehicles",
                  "Home essentials",
                  "Others",
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">

                {listings.map((item) => (
                  <Link
  key={item._id}
  href={`/item/${item.slug}`} // ✅ IMPORTANT
  className="bg-white/80 backdrop-blur-xl rounded-2xl p-3 sm:p-4 shadow-sm border border-white/40 hover:shadow-md hover:-translate-y-1 transition-all block"
>
  <img
    src={item.images[0]}
    className="w-full h-40 object-cover rounded-xl"
  />

  <h3 className="mt-2 sm:mt-3 font-medium text-gray-800 text-sm">
    {item.title}
  </h3>

  <p className="text-green-600 font-semibold mt-1">
    ₹{item.price}
  </p>

  <p className="text-xs text-gray-500 mt-1">
    📍 {item.location}
  </p>
</Link>
                ))}

              </div>
            ) : (
              <div className="bg-white/70 p-6 sm:p-10 rounded-2xl text-center">
                <p className="text-gray-600">No results found</p>
              </div>
            )}

          </div>
        </div>
      </div>

      {showFilterModal && (
  <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-end lg:hidden">
    
    {/* Modal Box */}
    <div className="bg-white w-full max-h-[85vh] rounded-t-2xl p-4 sm:p-5 overflow-y-auto">

      <h3 className="font-semibold text-lg mb-4 text-gray-700">Filters</h3>

      {/* Location */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Location</p>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Area, landmark or city"
          className="w-full px-3 py-2 border rounded-lg placeholder:text-gray-400 text-gray-900"
        />
      </div>

      {/* Price */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Price</p>
        <div className="flex gap-2">
          <input
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="w-full px-2 py-2 border rounded placeholder:text-gray-400 text-gray-900"
          />
          <input
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="w-full px-2 py-2 border rounded placeholder:text-gray-400 text-gray-900"
          />
        </div>
      </div>

      {/* Category */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Category</p>
        {[
          "Electronics",
          "Furniture",
          "Fashion",
          "Books",
          "Vehicles",
          "Home essentials",
          "Others",
        ].map((cat) => (
          <label key={cat} className="flex gap-2 text-sm mb-1 text-gray-600 ">
            <input
              type="radio"
              checked={category === cat}
              onChange={() => setCategory(cat)}
            />
            {cat}
          </label>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4 sm:mt-6">
        <button
          onClick={() => {
            clearFilters();
          }}
          className="flex-1 py-2 border rounded-lg text-red-500"
        >
          Clear
        </button>

        <button
          onClick={() => setShowFilterModal(false)}
          className="flex-1 py-2 bg-indigo-500 text-white rounded-lg"
        >
          Apply
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
}