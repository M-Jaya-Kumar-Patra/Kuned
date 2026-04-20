"use client";

import { useContext, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const auth = useContext(AuthContext);

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


return (
  <ProtectedRoute>
  <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#e9ecff] flex flex-col items-center justify-center px-4">


    {/* CARD */}
    <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] text-center">

      {/* ===== LOADING ===== */}
      {status === "loading" && (
        <>
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            Verifying your payment...
          </h2>

          <p className="text-gray-500 mt-2">
            This may take a few seconds
          </p>
        </>
      )}

      {/* ===== SUCCESS ===== */}
      {status === "success" && (
        <>
          <div className="flex justify-center mb-4">
            <img src="/images/payment/success.png" className="w-40" />
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            Payment Successful 🎉
          </h2>

          <p className="text-gray-500 mt-2 mb-4">
            Coins have been added to your wallet
          </p>

          

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white mb-2"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => router.push("/coins")}
            className="w-full py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            View Coin History
          </button>
        </>
      )}

      {/* ===== FAILED ===== */}
      {status === "failed" && (
        <>
          <div className="flex justify-center mb-4">
            <img src="/images/payment/failed.png" className="w-40" />
          </div>

          <h2 className="text-xl font-semibold text-red-600">
            Payment Failed
          </h2>

          <p className="text-gray-500 mt-2 mb-4">
            Something went wrong. Please try again
          </p>

          <button
            onClick={() => router.push("/buy-coins")}
            className="w-full py-2 rounded-lg bg-red-500 text-white mb-2"
          >
            Retry Payment
          </button>

          <button
            onClick={() => router.back()}
            className="w-full py-2 rounded-lg border border-gray-200 text-gray-600"
          >
            Go Back
          </button>
        </>
      )}

      {/* ===== PENDING ===== */}
      {status === "pending" && (
        <>
          <div className="flex justify-center mb-4">
            <img src="/images/payment/pending.png" className="w-40" />
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            Processing Payment...
          </h2>

          <p className="text-gray-500 mt-2">
            Please wait while we confirm your payment
          </p>
        </>
      )}

    </div>

    {/* FOOTER */}
    <div className="absolute bottom-5 text-sm text-gray-400 flex gap-6">
      <span>About</span>
      <span>Contact</span>
      <span>Privacy</span>
    </div>

  </div>
  </ProtectedRoute>
);
}