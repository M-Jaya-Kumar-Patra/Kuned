"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState("loading");

  useEffect(() => {
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    router.replace("/");
    return;
  }

  const interval = setInterval(async () => {
    const res = await fetch(`/api/payments/verify?orderId=${orderId}`);
    const data = await res.json();

    if (data.status === "success") {
      setStatus("success");
      clearInterval(interval);
    } else if (data.status === "failed") {
      setStatus("failed");
      clearInterval(interval);
    } else {
      setStatus("pending");
    }
  }, 2000); // every 2 sec

  return () => clearInterval(interval);
}, [searchParams, router]);
  if (status === "loading") {
    return <div className="h-screen flex items-center justify-center">Checking...</div>;
  }

  if (status === "success") {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-green-600 text-2xl font-bold">Payment Successful 🎉</h1>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-red-600 text-2xl font-bold">Payment Failed ❌</h1>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center">
      Processing payment... Please wait ⏳
    </div>
  );
}