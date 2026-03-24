"use client"
import { Search, Menu } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";


type Listing = {
  _id: string;
  title: string;
  price: number;
  slug: string;
  images: string[];
  location: string;
  category: string;
};


export default function HeroSection() {

   const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {

    const query = new URLSearchParams({
      keyword,
      location
    }).toString();

    router.push(`/search?${query}`);
  };


  return (
   <div className="relative pt-16 pb-6 overflow-hidden">

  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">

  <img
    src="/images/hero_shade.png"
    alt="hero shade"
    className="
      absolute
      left-1/2 top-1/2
      -translate-x-1/2 -translate-y-1/2

      h-[130%]
      max-w-none

      opacity-30
      blur-[2px]
    "
  />

</div>


  <div className="max-w-5xl mx-auto text-center relative z-10">

       <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black px-4">
          Buy, Sell & Discover Great Deals Near You
        </h1>

        <p className="text-gray-500 mt-3 text-sm sm:text-base px-4">
          Find great deals, connect with sellers, and shop securely — all in one place
        </p>

{/* Search Section */}
<div className="mt-10 mx-3 sm:mx-4 md:mx-5 lg:mx-6 flex justify-center">
  <div className="w-full max-w-5xl rounded-3xl px-6 py-6 
  bg-[#f8fafc]/80 backdrop-blur-xl shadow-md border border-white/40">

    {/* Top Row */}
    <div className="flex flex-col sm:flex-row gap-3">

      {/* Search Input */}
      <div className="flex items-center w-full h-[50px] sm:h-[56px] px-4 rounded-xl
bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500">

        <Search className="text-white/80 w-5 h-5 mr-3" />

        <input
          type="text"
          placeholder="Search for items..."
          className="w-full bg-transparent outline-none 
          text-white placeholder-white/80 text-[15px]"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {/* Search Button */}
      <button 
      onClick={handleSearch}
      className=" 
      bg-gradient-to-r from-indigo-500 to-blue-600 
      text-white font-medium text-[15px] shadow-sm hover:opacity-95 transition   h-[50px] sm:h-[56px] w-full sm:w-auto px-6 rounded-xl">
        Search
      </button>

      {/* Menu Button */}
      <div className="hidden sm:flex h-[56px] w-[56px] items-center justify-center
      rounded-xl bg-[#eef2ff] shadow-sm cursor-pointer">
        <Menu className="w-5 h-5 text-indigo-500" />
      </div>

    </div>

    {/* Categories */}
    <div className="flex gap-3 mt-5 flex-wrap">

      {["Books", "Electronics", "Furniture", "Accessories"].map((item) => (
        <div
          key={item}
          className="px-4 py-2 rounded-full text-sm 
          bg-[#eef2ff] text-gray-600 flex items-center gap-2 shadow-sm"
        >
          {/* Small dot icon (clean like UI) */}
          <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
          {item}
        </div>
      ))}

    </div>

  </div>
</div>

      </div>
    </div>
  );
}