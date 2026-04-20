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
  loading: boolean; // ✅ add this
  login: (userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  // 🔥 FETCH LATEST USER FROM BACKEND
  const refreshUser = async () => {
    try {
      const res = await fetch("/api/user/me", {
        credentials: "include",
      });

      if (res.status === 401) {
        setUser(null);
        return;
      }
      const data = await res.json();

      if (data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Refresh user failed", err);
      setUser(null);
    } finally {
      setLoading(false); // ✅ VERY IMPORTANT
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
      socket.disconnect();
    };
  }, [user?._id]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    socket.disconnect();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
