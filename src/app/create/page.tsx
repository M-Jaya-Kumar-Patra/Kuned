"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import Navbar from "@/components/Navbar";

export default function CreateListingPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await api.post("/listings/create", {
        ...form,
        price: Number(form.price),
        images,
      });

      router.push("/dashboard");
    } catch (error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "response" in error
  ) {
    const err = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    alert(err.response?.data?.message || "Failed to create listing");
  } else {
    alert("Failed to create listing");
  }
}
  };

  const [images, setImages] = useState<string[]>([]);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);




    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    console.log("Cloudinary response:", data);

    return data.secure_url;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];

    if (!files.length) return;

    try {
      setUploading(true);

      const uploadPromises = files.map((file) => uploadImage(file));

      const uploadedUrls = await Promise.all(uploadPromises);

      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {

  setImages((prev) => prev.filter((_, i) => i !== index));

};


  return (
  <div className="min-h-screen bg-gradient-to-b from-[#f5f7ff] to-[#eef1ff]">

    {/* Top spacing */}
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Title */}
      <h1 className="text-3xl font-semibold text-gray-800">
        Create a New Listing
      </h1>
      <p className="text-gray-500 mt-1">
        Sell your items quickly within your campus
      </p>

      {/* Main Card */}
      <div className="
        mt-8
        bg-white/70 backdrop-blur-xl
        border border-white/40
        rounded-3xl
        shadow-sm
        overflow-hidden
      ">

        <form onSubmit={handleSubmit}>

          {/* BASIC INFO */}
          <div className="p-6 border-b">
            <h2 className="font-semibold text-gray-700 mb-4">
              Basic Info <span className="text-red-500">*</span>
            </h2>

            <input
              name="title"
              placeholder="e.g. Study Table in Good Condition"
              className="w-full p-3 rounded-xl border bg-white/60 outline-none mb-4 text-gray-800
  placeholder:text-gray-400"
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Describe your item..."
              className="w-full p-3 rounded-xl border bg-white/60 outline-none h-28 text-gray-800
  placeholder:text-gray-400"
              onChange={handleChange}
            />
          </div>

          {/* GRID SECTION */}
          <div className="grid md:grid-cols-2">

            {/* LEFT SIDE */}
            <div className="p-6 space-y-6 border-r">

              {/* Price */}
              <div>
                <h3 className="text-sm text-gray-600 mb-2">
                  Price
                </h3>

                <input
                  name="price"
                  type="number"
                  placeholder="₹ Price"
                  className="w-full p-3 rounded-xl border bg-white/60 outline-none text-gray-800
  placeholder:text-gray-400"
                  onChange={handleChange}
                />
              </div>

              {/* Category */}
              <div>
                <h3 className="text-sm text-gray-600 mb-2">
                  Category
                </h3>

                <select
                  name="category"
                  className="w-full p-3 rounded-xl border bg-white/60 outline-none text-gray-800
  "
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  <option>Electronics</option>
                  <option>Furniture</option>
                  <option>Books</option>
                  <option>Cycles</option>
                  <option>Hostel Items</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-sm text-gray-600 mb-2">
                  Location
                </h3>

                <input
                  name="location"
                  placeholder="e.g. Pulaha HOR, VSSUT"
                  className="w-full p-3 rounded-xl border bg-white/60 outline-none text-gray-800
  placeholder:text-gray-400"
                  onChange={handleChange}
                />
              </div>

            </div>

            {/* RIGHT SIDE (UPLOAD) */}
            <div className="p-6">

              <h3 className="text-gray-700 font-semibold mb-3">
                Image Upload
              </h3>

              {/* Upload Box */}
              <label className="
                flex flex-col items-center justify-center
                border-2 border-dashed rounded-2xl
                h-40 cursor-pointer
                text-gray-500 hover:bg-gray-50 transition
              ">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                ⬆️ Drag & drop or click to upload
                <span className="text-xs mt-1">
                  JPEG or PNG (max 5MB)
                </span>
              </label>

              {/* Uploading */}
              {uploading && (
                <p className="text-sm text-gray-500 mt-2">
                  Uploading images...
                </p>
              )}

              {/* Preview */}
              <div className="flex gap-3 flex-wrap mt-4">

                {images.map((img, index) => (
                  <div key={index} className="relative">

                    <img
                      src={img}
                      className="w-24 h-24 object-cover rounded-xl border"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm"
                    >
                      ×
                    </button>

                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* SUBMIT */}
          <div className="p-6 border-t">

            <button
              disabled={uploading}
              className="
                w-full
                py-3
                rounded-xl
                text-white
                font-medium
                bg-gradient-to-r from-indigo-600 to-purple-500
                hover:opacity-90
                transition
                disabled:opacity-50
              "
            >
              Post Listing
            </button>

          </div>

        </form>

      </div>

    </div>

  </div>
);
}
