"use client";

import { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "next/navigation";
import api from "@/services/api";
import { socket } from "@/lib/socketClient";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

type Participant = {
  _id: string;
  name?: string;
};

type Conversation = {
  _id: string;
  participants: Participant[];
};

type Message = {
  _id: string;
  text: string;
  senderId: string;
  createdAt: string;
  seen: boolean;
  delivered: boolean;
};

type MessagesSeenEvent = {
  conversationId: string;
};

export default function ChatPage() {
  const params = useParams();
  const auth = useContext(AuthContext);
  const router = useRouter();



  const conversationId =
    typeof params.conversationId === "string" ? params.conversationId : "";

  const userId = auth?.user?._id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [otherUserId, setOtherUserId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
  if (!auth?.user) {
    router.push("/login");
  }
}, [auth?.user]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // useEffect(() => {
  //   if (!userId) return;

  //   socket.emit("registerUser", userId);
  // }, [userId]);

  // Fetch conversation to get other user
  useEffect(() => {
    if (!conversationId || !userId) return;

    const fetchConversation = async () => {
      try {
        const res = await api.get("/chat/conversations");

        const conversation = res.data.conversations.find(
          (c: Conversation) => c._id === conversationId,
        );

        if (!conversation) return;

        const otherUser = conversation.participants.find(
          (p: Participant) => p._id !== userId,
        );

        if (otherUser) {
          setOtherUserId(otherUser._id);
        }
      } catch (error) {
        console.error("Failed to get conversation", error);
      }
    };

    fetchConversation();
  }, [conversationId, userId]);

  // useEffect(() => {
  //   if (!conversationId || !messages.length) return;

  //   const lastMessage = messages[messages.length - 1];

  //   // Only mark seen if the last message was sent by the other user
  //   if (lastMessage.senderId === userId) return;

  //   const markSeen = async () => {
  //     await api.post("/chat/seen", { conversationId });

  //     socket.emit("messagesSeen", { conversationId });
  //   };

  //   markSeen();
  // }, [conversationId, messages, userId]);

  // Join socket room
  useEffect(() => {
    if (!conversationId) return;

    socket.emit("joinConversation", conversationId);

    const handleNewMessage = async (message: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });

      if (message.senderId !== userId) {
        socket.emit("messagesSeen", { conversationId });
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [conversationId, userId]);

useEffect(() => {
  if (!conversationId) return;

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/chat/messages/${conversationId}`);

      const msgs = res.data.messages ?? [];

      setMessages(msgs);

      const lastMessage = msgs[msgs.length - 1];

      // Only mark seen if the last message is from the other user
      if (lastMessage && lastMessage.senderId !== userId) {
        socket.emit("messagesSeen", { conversationId });
        await api.post("/chat/seen", { conversationId });
      }

    } catch (error) {
      console.error("Failed to load messages", error);
    }
  };

  fetchMessages();
}, [conversationId, userId]);

  // Update seen
  useEffect(() => {
    const handleMessagesSeen = ({
      conversationId: seenConversationId,
    }: MessagesSeenEvent) => {
      console.log("messagesSeen event received", seenConversationId);

      if (seenConversationId !== conversationId) return;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === userId ? { ...msg, seen: true } : msg,
        ),
      );
    };

    socket.on("messagesSeen", handleMessagesSeen);

    return () => {
      socket.off("messagesSeen", handleMessagesSeen);
    };
  }, [conversationId, userId]);

  useEffect(() => {
    const handleUserOnline = ({ userId: onlineUserId }: { userId: string }) => {
      if (onlineUserId !== otherUserId) return;

      setMessages((prev) =>
        prev.map((msg) => (msg.delivered ? msg : { ...msg, delivered: true })),
      );
    };

    socket.on("userOnline", handleUserOnline);

    return () => {
      socket.off("userOnline", handleUserOnline);
    };
  }, []);

  useEffect(() => {
    const handleDelivered = async ({ messageId }: { messageId: string }) => {
    
  setMessages(prev =>
    prev.map(msg =>
      msg._id === messageId
        ? { ...msg, delivered: true }
        : msg
    )
  );

  await api.post("/chat/delivered", { messageId });

};

    socket.on("messageDelivered", handleDelivered);

    return () => {
      socket.off("messageDelivered", handleDelivered);
    };
  }, []);

  const sendMessage = async () => {
    if (!text.trim() || !otherUserId) return;

    try {
      const res = await api.post("/chat/send", {
        conversationId,
        text,
      });

      const newMessage: Message = res.data.message;

      setMessages((prev) => [...prev, newMessage]);

      socket.emit("sendMessage", {
        conversationId,
        message: newMessage,
        receiverId: otherUserId,
      });

      setText("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDateLabel = (dateString: string) => {
    const date = new Date(dateString);

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const groupedMessages = messages.reduce(
    (groups, message) => {
      const dateKey = new Date(message.createdAt).toDateString();

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(message);

      return groups;
    },
    {} as Record<string, Message[]>,
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50 ">
      {/* HEADER */}
      <div className="bg-white shadow px-4 sm:px-6 py-3 flex items-center justify-between">
  <h1 className="font-semibold text-black text-base sm:text-lg">Chat</h1>
</div>
      {/* MESSAGE LIST */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-3 sm:py-4 space-y-2">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date} className="relative">
            {/* Sticky date header */}
            <div className="sticky top-0 z-10 flex justify-center py-2">
              <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full shadow">
                {getDateLabel(msgs[0].createdAt)}
              </span>
            </div>

            {msgs.map((msg) => {
              const isMine = msg.senderId === userId;

              return (
                <div
                  key={msg._id}
                  className={`flex ${
                    isMine ? "justify-end" : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`w-fit max-w-[80%] sm:max-w-[70%] px-3 py-2 rounded-lg text-sm flex flex-col ${
                      isMine
                        ? "bg-black text-white rounded-br-none"
                        : "bg-gray-300 text-black rounded-bl-none"
                    }`}
                  >
                    <span className="break-words">{msg.text}</span>

                    <div
                      className={`flex items-center gap-1 text-[10px] opacity-70 ${
                        isMine ? "self-end" : ""
                      }`}
                    >
                      <span>{formatTime(msg.createdAt)}</span>

                      {isMine && (
                        <span
                          className={
                            msg.seen ? "text-green-400 font-bold" : "font-bold"
                          }
                        >
                          {msg.seen ? "✓✓" : msg.delivered ? "✓✓" : "✓"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <div ref={messagesEndRef}></div>
      </div>

      {/* INPUT */}
      <div className="bg-white border-t px-2 sm:px-4 py-2 sm:py-3 flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border rounded-full px-3 sm:px-4 py-2 outline-none text-black text-sm"
          placeholder="Type a message..."
        />

        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 sm:px-6 py-2 rounded-full text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
