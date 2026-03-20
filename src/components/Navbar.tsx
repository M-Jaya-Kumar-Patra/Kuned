"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import NotificationBell from "./NotificationBell";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const auth = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  if (!auth) return null;

  const { user, logout } = auth;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-gray-200 px-6 py-2
     flex justify-between items-center shadow-sm">
      
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image src="/images/logo_light.png" alt="Kuden" width={140} height={100}/>
      </Link>

      
      {/* Right Section */}
      <div className="flex items-center gap-4 ">
        
        {user && (
          <div className="flex justify-between items-center gap-6 mx-4">
            <Link href="/chat" className="text-gray-600 hover:text-blue-600 transition font-semibold">
              Chat
            </Link>
            <Link href="/create" className="text-gray-600 hover:text-blue-600 transition font-semibold">
              Sell
            </Link>
          </div>
        )}
        
        {/* Coins */}
        {user && (
          <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full text-sm font-semibold text-yellow-700 shadow-sm">
            🪙 {(user?.bonusCoins ?? 0) + (user?.paidCoins ?? 0)}
          </div>
        )}

        {/* Notifications */}
        {user && <NotificationBell />}

        {/* Auth */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2"
            >
              <img
                src={user?.avatar || "/default-avatar.png"}
                alt="profile"
                className="w-9 h-9 rounded-full object-cover border"
              />
              <ChevronDown size={16} />
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-3 w-44 bg-white border rounded-xl shadow-lg py-2 text-sm">
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
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
        ) : (
          <div className="flex gap-3">
            <Link
              href="/login"
              className="text-gray-600 hover:text-blue-600"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition"
            >
              Signup
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}