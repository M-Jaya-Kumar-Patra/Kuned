"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
};

export default function ImageGallery({ images }: Props) {
  const [selected, setSelected] = useState(images?.[0] || "");
  const [zoomStyle, setZoomStyle] = useState({});

  if (!images || images.length === 0) {
    return <p>No images available</p>;
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.8)", // slightly less for performance
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transform: "scale(1)" });
  };

  return (
    <div className="w-full">
      {/* MAIN IMAGE */}
      <div
        className="relative w-full h-96 overflow-hidden rounded-lg border bg-gray-100"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={selected}
          alt="Product image"
          fill
          priority // ✅ FIX 1 (MOST IMPORTANT)
          sizes="(max-width:768px) 100vw, 600px"
          className="object-cover transition-transform duration-200"
          style={zoomStyle}
        />
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-3 mt-4 overflow-x-auto">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelected(img)}
            className={`relative w-20 h-20 rounded-md overflow-hidden border ${
              selected === img
                ? "border-blue-500 ring-2 ring-blue-300"
                : "border-gray-200"
            }`}
          >
            <Image
              src={img}
              alt={`Thumbnail ${index + 1}`}
              fill
              sizes="80px"
              className="object-cover"
              // ❌ removed priority here (important)
            />
          </button>
        ))}
      </div>
    </div>
  );
}
