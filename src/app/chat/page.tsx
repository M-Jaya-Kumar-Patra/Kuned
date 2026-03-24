"use client";

import { useEffect, useState, useContext } from "react";
import api from "@/services/api";
import { AuthContext } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { socket } from "@/lib/socketClient";

type User = {
  _id: string;
  name: string;
};

type Listing = {
  _id: string;
  title: string;
};

type Conversation = {
  _id: string;
  participants: User[];
  listingId: Listing;
  unseenCount: number;
  updatedAt: string;
};

export default function ChatPage() {

  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const auth = useContext(AuthContext);
  const pathname = usePathname();

  const userId = auth?.user?._id;


  useEffect(() => {
  if (!auth?.user) {
    router.push("/login");
  }
}, [auth?.user]);


  const fetchChats = async () => {
    try {
      const res = await api.get<{ conversations: Conversation[] }>(
        "/chat/conversations"
      );
      setConversations(res.data.conversations);
    } catch (err) {
      console.error("Failed to fetch chats", err);
    }
  };

  useEffect(() => {
  const interval = setInterval(() => {
    setConversations(prev => prev); // trigger re-render
  }, 60000); // every 1 min

  return () => clearInterval(interval);
}, []);

  useEffect(() => {
  const load = async () => {
    await fetchChats();
  };
  load();
}, [pathname]);

  useEffect(() => {
    if (!conversations.length) return;
    conversations.forEach((conv) => {
      socket.emit("joinConversation", conv._id);
    });
  }, [conversations]);

  useEffect(() => {
  const handleNewMessage = async () => {
    await fetchChats();
  };

  socket.on("newMessage", handleNewMessage);

  return () => {
    socket.off("newMessage", handleNewMessage);
  };
}, []);

  useEffect(() => {
  const handleMessagesSeen = (data: { conversationId: string }) => {
    setConversations(prev =>
      prev.map(conv =>
        conv._id === data.conversationId
          ? { ...conv, unseenCount: 0 }
          : conv
      )
    );
  };

  socket.on("messagesSeen", handleMessagesSeen);

  return () => {
    socket.off("messagesSeen", handleMessagesSeen);
  };
}, []);

  // filter chats
  const filteredChats = conversations
  .filter((conv) => {
    const otherUser = conv.participants.find(
      (p) => p._id !== userId
    );

    const name = otherUser?.name?.toLowerCase() || "";
    const title = conv.listingId?.title?.toLowerCase() || "";
    const query = search.toLowerCase();

    return name.includes(query) || title.includes(query);
  })
  .sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() -
      new Date(a.updatedAt).getTime()
  );

  const highlightText = (text: string, query: string) => {
  if (!query) return text;

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const regex = new RegExp(`(${escapedQuery})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className=" text-blue-500 font-bold rounded">
        {part}
      </span>
    ) : (
      part
    )
  );
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const diff = (now.getTime() - date.getTime()) / 1000; // seconds

  if (diff < 60) return "Just now";

  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;

  if (diff < 86400) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (diff < 172800) return "Yesterday";

  return date.toLocaleDateString();
};

  return (
  <div className="min-h-screen flex justify-center items-start pt-4 sm:pt-6 px-2 sm:px-4 bg-gradient-to-br from-purple-50 to-blue-50">
    {/* Main Chat Container */}
    <div className="w-full max-w-full sm:max-w-2xl bg-white/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Chats</h1>
        <span className="text-gray-400 text-xl">•••</span>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
  type="text"
  placeholder="Search conversations..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full px-3 sm:px-4 py-2 rounded-xl text-black placeholder:text-gray-500 bg-white/70 border border-gray-200 text-sm outline-none"
/>
      </div>

      {/* Chat List */}
<div className="space-y-2">

  {filteredChats.length > 0 ? (
    filteredChats.map((conv) => {
      const otherUser = conv.participants.find(
        (p) => p._id !== userId
      );

      return (
        <div
          key={conv._id}
          onClick={() => router.push(`/chat/${conv._id}`)}
          className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl cursor-pointer hover:bg-white/80 transition">

          {/* Avatar */}
          <div className="relative">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {otherUser?.name?.charAt(0)}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm sm:text-base text-gray-800">
  {highlightText(otherUser?.name || "", search)}
</p>

              <span className="text-[10px] sm:text-xs text-gray-400">
  {formatTime(conv.updatedAt)}
</span>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 truncate">
  {highlightText(conv.listingId?.title || "", search)}
</p>
          </div>

          {/* Unread */}
          {conv.unseenCount > 0 && (
            <div className="bg-indigo-500 text-white text-xs w-5 h-5 sm:w-6 sm:h-6 text-[10px] sm:text-xs flex items-center justify-center rounded-full">
              {conv.unseenCount}
            </div>
          )}
        </div>
      );
    })
  ) : (
    // 🔥 EMPTY STATE
    <div className="flex flex-col items-center justify-center py-16 text-center">

      <img
        src="/images/chats/robot.png"
        alt="No chats"
        className="w-28 sm:w-40 mb-4 opacity-90"
      />

      <p className="text-gray-600 font-medium text-lg">
        {search ? "No results found" : "No chats yet 🙂"}
      </p>

      <p className="text-sm text-gray-400 mt-1">
        {search
          ? "Try searching with a different name"
          : "Start a conversation by contacting a seller"}
      </p>
    </div>
  )}

</div>
    </div>
  </div>
);
}