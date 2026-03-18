"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import ChatButton from "@/components/ChatButton";

type Props = {
  listingId: string;
  sellerId: string;
};

export default function ListingActions({ listingId, sellerId }: Props) {

  const auth = useContext(AuthContext);
 
  if (!auth) return null;

  const { user } = auth;

  // If seller is viewing their own listing
  if (user?._id === sellerId) {
    return (
      <p className="text-gray-500 text-sm">
        This is your listing
      </p>
    );
  }

  return (
    <div className="mt-6 flex gap-4">

      <ChatButton
        listingId={listingId}
        sellerId={sellerId}
      />

      <a
        href={`/report?listing=${listingId}`}
        className="border px-6 py-2 rounded"
      >
        Report Listing
      </a>

    </div>
  );
}