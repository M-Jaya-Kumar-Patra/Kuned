"use client";

import Link from "next/link";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import NotificationBell from "./NotificationBell";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const auth = useContext(AuthContext);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
  if (
    dropdownRef.current &&
    !dropdownRef.current.contains(event.target as Node)
  ) {
    setOpen(false);
  }
}

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);



  const { user, logout, loading } = auth!;
  

  

  return (
    <nav className="sticky top-0 z-50 h-16 backdrop-blur-md bg-white/95 border-b border-gray-200 px-3 sm:px-6 py-2
     flex justify-between items-center shadow-sm">
    <div className="flex justify-center items-center shrink-0">
  <Link href="/" className="relative inline-block group cursor-pointer">
    {/* Logo */}
    <Image
      src="/images/logo_light.png"
      alt="Kuned"
      width={140}
      height={46}
    />

    {/* BETA badge */}
    <span className="absolute bottom-0.5 right-2 text-[6px] bg-indigo-600 text-white px-2  rounded-full font-semibold shadow">
      BETA
    </span>

    {/* Tooltip */}
  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 text-[10px] sm:text-xs bg-black/70 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
    Home page
  </span>
  </Link>
</div>

      
      {/* Right Section */}
      <div className="flex items-center gap-4">

  {loading ? (
    // 🔥 SKELETON UI
    <>
      {/* Chat & Sell skeleton */}
      <div className="hidden sm:flex gap-6 mx-4">
        <div className="w-12 h-4 bg-gray-200 animate-pulse rounded"></div>
        <div className="w-12 h-4 bg-gray-200 animate-pulse rounded"></div>
        <div className="w-12 h-4 bg-gray-200 animate-pulse rounded"></div>
      </div>

      {/* Coins skeleton */}
      <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
       
        <div className="w-16 h-8 rounded-full bg-gray-300 animate-pulse rounded"></div>
      </div>

      {/* Notification bell skeleton */}
      <div className="w-6 h-6 bg-gray-200 animate-pulse rounded-full"></div>

      {/* Avatar skeleton */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 bg-gray-300 animate-pulse rounded-full"></div>
      </div>
    </>
  ) : user ? (
    <>
      {/* Chat & Sell */}
      <div className="hidden sm:flex justify-between items-center gap-6 mx-4">
        <Link href="/" className="text-gray-600 hover:text-blue-600 transition font-semibold">
          Home
        </Link>
        <Link href="/chat" className="text-gray-600 hover:text-blue-600 transition font-semibold">
          Chat
        </Link>
        <Link href="/create" className="text-gray-600 hover:text-blue-600 transition font-semibold">
          Sell
        </Link>
      </div>

      {/* Coins */}
      <div className="hidden sm:flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full text-sm font-semibold text-yellow-700 shadow-sm shrink-0">
        🪙 {(user?.bonusCoins ?? 0) + (user?.paidCoins ?? 0)}
      </div>

      {/* Notifications */}
      <NotificationBell />

      {/* Avatar */}
      <div
  className="relative"
  ref={dropdownRef}
  onMouseEnter={() => setOpen(true)}
  onMouseLeave={() => setOpen(false)}
>
        <button
  onClick={(e) => {
    e.stopPropagation(); // prevent conflict
    router.push("/profile");
  }}
  className="flex items-center gap-2"
>
          <img
            src={user?.avatar || "/images/default-avatar.png"}
            alt="profile"
            className="w-9 h-9 rounded-full object-cover border shrink-0"
          />
          <ChevronDown size={16} />
        </button>

        {open && (
          <div className="absolute right-0  w-44 bg-white border rounded-xl shadow-lg py-2 text-sm">
            <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100 text-black">
              Profile
            </Link>
            <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 text-black">
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  ) : (
    <>
      {/* Logged out */}
      <Link href="/login" className="text-gray-600 hover:text-blue-600">
        Login
      </Link>
      <Link href="/signup" className="bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition">
        Signup
      </Link>
    </>
  )}
</div>
    </nav>
  );
}