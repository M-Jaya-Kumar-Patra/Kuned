"use client";

import { useState, useEffect, useContext } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/services/api";
import { AuthContext } from "@/context/AuthContext";

export default function VerifyEmailContent() {
  const params = useSearchParams();
  const router = useRouter();

  const auth = useContext(AuthContext);

  const email = params.get("email");

  const [pin, setPin] = useState("");
  const [timer, setTimer] = useState(30);


  useEffect(() => {
  if (auth?.user) {
    router.push("/");
  }
}, [auth?.user]);


  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

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

    setTimer(30); // 🔥 reset timer

    alert("PIN sent again");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#e9ecff] flex items-center justify-center px-4 relative">
      {/* Background Illustration */}
      <div className="absolute inset-0 flex justify-center items-start opacity-20">
        <img src="/images/login/email.png" className="w-[400px] mt-10" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Verify your email
        </h2>

        <p className="text-gray-500 mt-2">Enter the 6-digit code sent to</p>

        <p className="text-blue-600 font-medium mb-6">{email}</p>

        {/* OTP Inputs */}
        <div className="flex justify-between gap-2 mb-6">
          {[...Array(6)].map((_, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              maxLength={1}
              value={pin[i] || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                if (!value) return;

                const newPin =
                  pin.substring(0, i) + value + pin.substring(i + 1);

                setPin(newPin);

                // 👉 move to next input
                const next = document.getElementById(`otp-${i + 1}`);
                if (next) (next as HTMLInputElement).focus();
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  if (!pin[i]) {
                    const prev = document.getElementById(`otp-${i - 1}`);
                    if (prev) (prev as HTMLInputElement).focus();
                  }

                  const newPin =
                    pin.substring(0, i) + "" + pin.substring(i + 1);

                  setPin(newPin);
                }
              }}
              className="w-12 h-12 text-center text-gray-700 text-lg rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={verifyPin}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium hover:opacity-90 transition"
        >
          Verify Email
        </button>

        {/* Resend Section */}
        <p className="text-gray-500 text-sm mt-4">Didn’t receive the code?</p>

        <p className="text-gray-400 text-sm mb-3">
          {timer > 0 ? `Resend in ${timer}s` : "You can resend now"}
        </p>

        <button
          onClick={resendPin}
          disabled={timer > 0}
          className={`w-full py-2 rounded-lg border transition ${
            timer > 0
              ? "border-gray-200 text-gray-400 cursor-not-allowed"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          Resend Code
        </button>
      </div>
    </div>
  );
}
