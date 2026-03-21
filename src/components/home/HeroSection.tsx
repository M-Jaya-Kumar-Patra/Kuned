import { Search, Menu } from "lucide-react";


export default function HeroSection() {
  return (
   <div className="relative py-16 overflow-hidden">

    <div className="absolute inset-0 pointer-events-none z-0 flex  justify-center">
  <img
    src="/images/hero_shade.png"
    alt="hero shade"
    className="w-[100vw] h-[130%] object-cover opacity-20"
  />
</div>


  <div className="max-w-5xl mx-auto text-center relative z-10">

        <h1 className="text-4xl text-black font-bold"> 
          Buy, Sell & Discover Great Deals Near You
        </h1>

        <p className="text-gray-500 mt-3">
          Find great deals, connect with sellers, and shop securely — all in one place
        </p>

{/* Search Section */}
<div className="mt-10 flex justify-center">
  <div className="w-full max-w-5xl rounded-3xl px-6 py-6 
  bg-[#f8fafc]/80 backdrop-blur-xl shadow-md border border-white/40">

    {/* Top Row */}
    <div className="flex items-center gap-4">

      {/* Search Input */}
      <div className="flex items-center flex-1 h-[56px] px-5 rounded-xl
      bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 shadow-sm">

        <Search className="text-white/80 w-5 h-5 mr-3" />

        <input
          type="text"
          placeholder="Search for items..."
          className="w-full bg-transparent outline-none 
          text-white placeholder-white/80 text-[15px]"
        />
      </div>

      {/* Search Button */}
      <button className="h-[56px] px-8 rounded-xl 
      bg-gradient-to-r from-indigo-500 to-blue-600 
      text-white font-medium text-[15px] shadow-sm hover:opacity-95 transition">
        Search
      </button>

      {/* Menu Button */}
      <div className="h-[56px] w-[56px] flex items-center justify-center 
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