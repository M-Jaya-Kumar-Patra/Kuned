"use client";

import api from "@/services/api";

type Props = {
  listingId: string;
};

export default function PromoteListing({ listingId }: Props) {

  const promote = async (type: string) => {

    try {

      await api.post("/api/listings/promote", {
        listingId,
        type
      });

      alert("Listing promoted successfully!");

    } catch (error) {

      console.error("Promotion failed");

    }

  };

  return (
    <div className="flex gap-2 mt-2">

      <button
        onClick={() => promote("highlight")}
        className="border px-3 py-1 text-sm"
      >
        Highlight
      </button>

      <button
        onClick={() => promote("top")}
        className="border px-3 py-1 text-sm"
      >
        Top
      </button>

      <button
        onClick={() => promote("urgent")}
        className="border px-3 py-1 text-sm"
      >
        Urgent
      </button>

    </div>
  );
}