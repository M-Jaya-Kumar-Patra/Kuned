"use client";

import api from "@/services/api";
import { useContext, useState } from "react";
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

  const [loading, setLoading] = useState(false);

  const isSeller = user?._id === sellerId;

  const startChat = async () => {

    if (isSeller || loading) return;

    try {
      setLoading(true);

      const res = await api.post("/chat/start", {
        listingId,
        sellerId
      });

      const conversationId = res.data.conversation._id;

      router.push(`/chat/${conversationId}`);

    } catch (err) {
      console.error("Chat start failed", err);
      alert("Failed to start chat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={startChat}
      disabled={isSeller || loading}
      className={` h-[42px]  px-6 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2
        ${
          isSeller
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:opacity-90"
        }
      `}
    >

      {loading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      )}

      {isSeller
        ? "Your Listing"
        : loading
        ? "Starting..."
        : "Chat with Seller"}

    </button>
  );
}