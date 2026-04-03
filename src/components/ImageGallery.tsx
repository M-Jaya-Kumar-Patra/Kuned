"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
};

export default function ImageGallery({ images }: Props) {

  const [selected, setSelected] = useState(images?.[0] || "");
  const [zoomStyle, setZoomStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: "scale(1)",
    });
  };

  if (!images || images.length === 0) {
    return <p>No images available</p>;
  }

  return (
    <div className="w-full">

      {/* Main Image */}
      <div
        className="relative w-full h-96 overflow-hidden rounded-lg border cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >

        <Image
          src={selected}
          alt="Product image"
          fill
          sizes="(max-width:768px) 100vw, 600px"
          style={zoomStyle}
          className="object-cover transition-transform duration-200"
        />

      </div>

      {/* Thumbnails */}
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
              priority
              className="object-cover"
            />

          </button>

        ))}

      </div>

    </div>
  );
}