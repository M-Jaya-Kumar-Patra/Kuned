"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import Loader from "./ui/Loader";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useContext(AuthContext)!;
  const router = useRouter();

  useEffect(() => {
    if (auth?.loading) return;

    if (!auth?.user) {
      router.replace("/login");
    }
  }, [auth?.loading, auth?.user]);

  // ⛔ wait until auth is resolved
  if (auth?.loading) {
    return <Loader/>; // or loader
  }

  // ⛔ block rendering if not logged in
  if (!auth?.user) {
    return <Loader/>;
  }

  return <>{children}</>;
}