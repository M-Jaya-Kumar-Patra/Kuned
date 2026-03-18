"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  const { user, logout } = auth;

  console.log(user);

  return (
    <nav className="flex justify-between items-center p-4 shadow-md">
      <Link href="/" className="text-xl font-bold">
        Kuned
      </Link>

      <div className="flex gap-4">
        <Link href="/search">Browse</Link>

        {user ? (
          <>
            <Link href="/chat">Chats</Link>
            <Link href="/create">Sell</Link>
            <Link href="/dashboard">Dashboard</Link>
            <button onClick={logout}>Logout</button>
            <Link href="/profile">Profile</Link>

          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
          </>
        )}
      </div>

      {/* Notification Bell */}
      <div className="flex items-center gap-4">
        <div className="flex gap-3 items-center">
          <span>🪙 {(user?.bonusCoins ?? 0) + (user?.paidCoins ?? 0)}</span>
        </div>

        <NotificationBell />
      </div>
    </nav>
  );
}
