"use client";

import { useEffect, useState, useContext, useRef  } from "react";
import api from "@/services/api";
import { AuthContext } from "@/context/AuthContext";
import type { Notification } from "@/types/notification";
import { socket } from "@/lib/socketClient";
import { usePathname } from "next/navigation";



export default function NotificationBell() {
  const auth = useContext(AuthContext);

  const user = auth?.user;
  const pathname = usePathname();
  const bellRef = useRef<HTMLDivElement | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
  if (!auth?.loading && !user) return;


  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications ?? []);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  fetchNotifications();
}, [user, pathname]); 

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      bellRef.current &&
      !bellRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const handleOpen = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (nextOpen) {
      try {
        await api.post("/notifications/read");

        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            isRead: true,
          })),
        );
      } catch (error) {
        console.error("Failed to mark notifications as read", error);
      }
    }
  };

  const unreadUsers = new Set(
  notifications
    .filter((n) => !n.isRead && n.type === "chat")
    .map((n) => n.senderId)
);

const unreadCount = unreadUsers.size;
  return (
    <div ref={bellRef} className="relative">
      <button onClick={(e) => {
  e.stopPropagation();
  handleOpen();
}} className="relative shrink-0 ">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1 rounded">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow">
          {notifications.length === 0 && (
            <p className="p-3 text-gray-500">No notifications</p>
          )}

          {notifications.map((n) => (
            <div key={n._id} className="p-3 border-b hover:bg-gray-50">
              <p className="font-medium">{n.title}</p>
              <p className="text-sm text-gray-600">{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
