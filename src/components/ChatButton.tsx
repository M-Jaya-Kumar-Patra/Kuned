"use client";

import api from "@/services/api";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ChatButton({
  listingId,
  sellerId
}: {
  listingId: string;
  sellerId: string;
}) {

  const router = useRouter();
  const { user } = useContext(AuthContext)!;

  const isSeller = user?._id === sellerId;

  const startChat = async () => {

    if (isSeller) return;

    const res = await api.post("/chat/start", {
      listingId,
      sellerId
    });

    const conversationId = res.data.conversation._id;

    router.push(`/chat/${conversationId}`);
  };

  return (
    <button
      onClick={startChat}
      disabled={isSeller}
      className={`px-6 py-2 rounded ${
        isSeller
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-black text-white"
      }`}
    >
      {isSeller ? "Your Listing" : "Chat with Seller"}
    </button>
  );
}