"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/services/api";

export default function VerifyEmailContent() {
  const params = useSearchParams();
  const router = useRouter();

  const email = params.get("email");

  const [pin, setPin] = useState("");

  const verifyPin = async () => {
    if (!email) {
      alert("Invalid request");
      return;
    }

    await api.post("/auth/verify-email", {
      email,
      pin,
    });

    alert("Email verified!");
    router.push("/login");
  };

  const resendPin = async () => {
    if (!email) {
      alert("Invalid request");
      return;
    }

    await api.post("/auth/resend-pin", { email });
    alert("PIN sent again");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96 border p-6 rounded">
        <h2 className="text-xl font-bold mb-4">Verify Email</h2>

        <input
          placeholder="Enter 6 digit PIN"
          className="w-full border p-2 mb-3"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        <button
          onClick={verifyPin}
          className="bg-black text-white w-full p-2"
        >
          Verify
        </button>

        <button
          onClick={resendPin}
          className="text-blue-600 mt-2"
        >
          Resend PIN
        </button>
      </div>
    </div>
  );
}