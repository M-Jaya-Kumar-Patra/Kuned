"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import ChatButton from "@/components/ChatButton";
import Link from "next/link";
import Loader from "@/components/ui/Loader";

type Props = {
  listingId: string;
  sellerId: string;
};

export default function ListingActions({ listingId, sellerId }: Props) {

  const auth = useContext(AuthContext);

  if (!auth) return <Loader/>;

  const { user } = auth;

  const isSeller = user?._id === sellerId;

  // If seller is viewing their own listing
  if (isSeller) {
    return (
      <div className="mt-6">
        <p className="text-gray-500 text-sm bg-gray-100 px-4 py-2 rounded-lg inline-block">
          This is your listing
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 flex gap-4 flex-wrap items-center">

      {/* CHAT BUTTON */}
      <ChatButton
        listingId={listingId}
        sellerId={sellerId}
      />

      {/* REPORT BUTTON */}
      <Link
        href={`/report?listing=${listingId}`}
        className=" h-[42px]  px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
      >
        Report
      </Link>

    </div>
  );
}