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
  const router = useRouter();
  const auth = useContext(AuthContext);
  const pathname = usePathname();

  const userId = auth?.user?._id;

  // fetch conversations
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

  // load when page opens
  useEffect(() => {
    const loadChats = async () => {
    try {
      const res = await api.get<{ conversations: Conversation[] }>(
        "/chat/conversations"
      );
      setConversations(res.data.conversations);
    } catch (err) {
      console.error("Failed to fetch chats", err);
    }
  };
  loadChats()
  }, [pathname]);

  // join conversation rooms
  useEffect(() => {
    if (!conversations.length) return;

    conversations.forEach((conv) => {
      socket.emit("joinConversation", conv._id);
    });
  }, [conversations]);

  // listen for realtime messages
  useEffect(() => {
    const handleNewMessage = () => {
      fetchChats();
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);

 useEffect(() => {

  const handleMessagesSeen = ({ conversationId }: { conversationId: string }) => {

    setConversations(prev =>
      prev.map(conv =>
        conv._id === conversationId
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




  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Chats</h1>

      <div className="space-y-3">
        {conversations.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
  .map((conv) => {
          const otherUser = conv.participants.find(
            (p) => p._id !== userId
          );

          return (
            <div
              key={conv._id}
              onClick={() => router.push(`/chat/${conv._id}`)}
              className="p-4 border rounded cursor-pointer hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold">{otherUser?.name}</p>

                {conv.unseenCount > 0 && (
                  <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                    {conv.unseenCount}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500">
                {conv.listingId?.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}