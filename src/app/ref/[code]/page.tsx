"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReferralPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const router = useRouter();

  useEffect(() => {
    const handle = async () => {
      const resolvedParams = await params; // ✅ unwrap

      const referralCode = resolvedParams.code;

      localStorage.setItem("referralCode", referralCode);

      router.push("/signup");
    };

    handle();
  }, [params, router]);

  return (
    <div className="h-screen flex items-center justify-center text-lg">
      Redirecting...
    </div>
  );
}