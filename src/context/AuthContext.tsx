"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { socket } from "@/lib/socketClient";

type User = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  bonusCoins?: number;
  paidCoins?: number;
  referralCode?: string;
};

type AuthContextType = {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>; // ✅ important
};

export const AuthContext = createContext<AuthContextType | null>(null);

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;

    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // 🔥 FETCH LATEST USER FROM BACKEND
  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data?.user) {
        setUser(data.user);

        // ✅ sync localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (err) {
      console.error("Refresh user failed", err);
    }
  };

  // 🔥 AUTO REFRESH ON APP LOAD
  useEffect(() => {
    const init = async () => {
      await refreshUser();
    };
    init();
  }, []);

  // 🔥 SOCKET REGISTER
  useEffect(() => {
  if (!user?._id) return;

  socket.connect();
  socket.emit("registerUser", user._id);

  return () => {
    socket.disconnect(); // ✅ cleanup function
  };
}, [user?._id]);

  const login = (userData: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    socket.disconnect();
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}