"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const categories = [
  { name: "Books", image: "/icons/books.png" },
  { name: "Electronics", image: "/icons/laptop.png" },
  { name: "Furniture", image: "/icons/chair.png" },
  { name: "Fashion", image: "/icons/tshirt.png" },
  { name: "Others", image: "/icons/box.png" },
];

export default function CategorySection() {

  const router = useRouter();

  const handleCategoryClick = (category: string) => {

    const params = new URLSearchParams();
    params.set("category", category);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="mt-12 ">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
          <span className="text-yellow-400 text-xl">✨</span>
          Categories
        </h2>

        <button 
        onClick={()=>router.push("/search?keyword=&location=")}
        className="flex items-center gap-1 text-indigo-500 text-sm font-medium hover:gap-2 transition-all cursor-pointer">
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-5 gap-6">

        {categories.map((cat, i) => (
          <div
            key={i}
            onClick={() => handleCategoryClick(cat.name)}
            className="bg-white/70 backdrop-blur-md 
            rounded-2xl p-6 text-center 
            shadow-sm hover:shadow-md 
            transition cursor-pointer border border-white/40"
          >

            <div className="flex justify-center mb-4">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-16 h-16 object-contain"
              />
            </div>

            <p className="text-gray-700 font-medium">
              {cat.name}
            </p>

          </div>
        ))}

      </div>
    </div>
  );
}