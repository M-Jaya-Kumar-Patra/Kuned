"use client";

import { useState, useEffect } from "react";
import api from "@/services/api";

export default function SaveListingButton({
  listingId
}: {
  listingId: string;
}) {

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // load saved state
  useEffect(() => {
    checkSaved();
  }, [listingId]);

  const checkSaved = async () => {
    try {
      const res = await api.get(`/wishlist/check?listingId=${listingId}`);
      setSaved(res.data.saved);
    } catch (err) {
      console.error("Check saved failed", err);
    }
  };

  const toggleSave = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await api.post("/wishlist/toggle", {
        listingId
      });

      setSaved(res.data.saved);

    } catch (err) {
      console.error("Toggle save failed", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
  onClick={toggleSave}
  disabled={loading}
  className={`h-[42px] mt-6 px-5 rounded-lg border flex items-center gap-2 transition font-medium
    ${
      saved
        ? "bg-red-50 border-red-200 text-red-600"
        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
    }
  `}
>

      {/* ICON */}
      <span className="text-base leading-none">
        {saved ? "❤️" : "🤍"}
      </span>

      {/* TEXT */}
      {loading
        ? "Saving..."
        : saved
        ? "Saved"
        : "Save"}

    </button>
  );
}