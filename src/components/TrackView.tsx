"use client";

import { useEffect } from "react";
import api from "@/services/api";

export default function TrackView({
  listingId
}: {
  listingId: string;
}) {
  useEffect(() => {
    
    // save to localStorage
    const viewed = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]"
    );

    const updated = [
      listingId,
      ...viewed.filter((id: string) => id !== listingId)
    ].slice(0, 10);

    localStorage.setItem(
      "recentlyViewed",
      JSON.stringify(updated)
    );

    // optional: save to DB if logged in
    api.post("/recently-viewed", { listingId }).catch(() => {});

  }, [listingId]);

  return null;
}