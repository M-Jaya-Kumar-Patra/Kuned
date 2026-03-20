export default function HeroSection() {
  return (
   <div className="relative bg-white py-16 overflow-hidden">

  {/* RIGHT GLOW */}
  <div className="absolute right-[-100px] top-[-100px] w-[500px] h-[500px]
    bg-blue-400 opacity-20 blur-[120px] rounded-full" />

  {/* BOTTOM FADE (IMPORTANT) */}
  <div className="absolute bottom-0 left-0 w-full h-32 
    bg-gradient-to-b from-transparent to-gray-50" />

  <div className="max-w-5xl mx-auto text-center relative z-10">

        <h1 className="text-4xl font-bold">
          Buy & Sell Easily Within Your Campus
        </h1>

        <p className="text-gray-500 mt-3">
          Discover deals, chat with sellers, and pay securely using coins
        </p>

        {/* Search Bar */}
        <div className="mt-8 flex gap-2 justify-center">
          <input
            type="text"
            placeholder="Search for items..."
            className="w-2/3 px-4 py-3 border rounded-lg"
          />
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
            Search
          </button>
        </div>

      </div>
    </div>
  );
}