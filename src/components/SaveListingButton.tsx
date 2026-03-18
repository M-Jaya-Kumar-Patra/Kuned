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
  }, []);

  const checkSaved = async () => {
    try {
      const res = await api.get(`/wishlist/check?listingId=${listingId}`);
      setSaved(res.data.saved);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSave = async () => {
    try {
      setLoading(true);

      const res = await api.post("/wishlist/toggle", {
        listingId
      });

      setSaved(res.data.saved);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleSave}
      disabled={loading}
      className="px-4 py-2 rounded-lg border hover:bg-gray-100"
    >
      {saved ? "❤️ Saved" : "🤍 Save"}
    </button>
  );
}