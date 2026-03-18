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
    } catch (error) {
  alert(error?.response?.data?.message || "Failed to create listing");
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
    <div>
      <Navbar />

      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Create Listing</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Title"
            className="w-full border p-2"
            onChange={handleChange}
          />

          <input
            name="description"
            placeholder="Description"
            className="w-full border p-2"
            onChange={handleChange}
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            className="w-full border p-2"
            onChange={handleChange}
          />

          {/* Category dropdown */}

          <select
            name="category"
            className="w-full border p-2"
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Books">Books</option>
            <option value="Cycles">Cycles</option>
            <option value="Hostel Items">Hostel Items</option>
          </select>

          <input
            name="location"
            placeholder="Location"
            className="w-full border p-2"
            onChange={handleChange}
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />

          {uploading && (
  <p className="text-sm text-gray-500">
    Uploading images...
  </p>
)}

          <div className="flex gap-3 flex-wrap">

  {images.map((img, index) => (

    <div key={index} className="relative">

      <img
        src={img}
        className="w-24 h-24 object-cover rounded border"
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

          <button
  disabled={uploading}
  className="bg-black text-white px-4 py-2 disabled:opacity-50"
>
            Create Listing
          </button>
        </form>
      </div>
    </div>
  );
}
