"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function ForgotPasswordPage() {

  const router = useRouter();
  const auth = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [timer, setTimer] = useState(60);


  useEffect(() => {
  if (!auth?.user) {
    router.push("/login");
  }
}, [auth?.user]);


  const handleSubmit = async () => {

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    setShowPopup(true);
    setTimer(60);
  };

  useEffect(() => {

    if (!showPopup) return;

    const interval = setInterval(() => {

      setTimer((prev) => {

        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(interval);

  }, [showPopup]);

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#e9ecff] flex items-center justify-center px-4 relative">

    {/* Card */}
    <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] text-center">

      {!showPopup ? (
        <>
          {/* 🔐 ICON */}
          <div className="flex justify-center mb-4">
            <img src="/images/forgot_password/lock.png" className="w-40" />
          </div>

          <h2 className="text-2xl font-semibold text-gray-800">
            Forgot Password
          </h2>

          <p className="text-gray-500 mt-2 mb-6">
            Enter your email and we’ll send you a reset link
          </p>

          {/* Input */}
          <div className="mb-4 text-left">
            <label className="text-sm text-gray-600">
              Email Address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 px-4 py-2 rounded-lg border placeholder:text-gray-400 text-gray-900 border-gray-200 bg-white focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-2 rounded-lg cursor-pointer bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium hover:opacity-90 transition"
          >
            Send Reset Link
          </button>

          {/* Bottom */}
          <p className="text-sm text-gray-500 mt-4">
            Remembered your password?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </>
      ) : (
        <>
          {/* ✅ SUCCESS ICON */}
          <div className="flex justify-center mb-4">
            <img src="/images/forgot_password/success.png" className="w-40" />
          </div>

          <h2 className="text-2xl font-semibold text-gray-800">
            Reset link sent!
          </h2>

          <p className="text-gray-500 mt-2 mb-4">
            Check your email (<span className="font-medium">{email}</span>)
          </p>

          {/* Timer */}
          {timer > 0 ? (
            <p className="text-gray-400 text-sm mb-4">
              Resend in {timer}s
            </p>
          ) : (
            <button
              onClick={handleSubmit}
              className="w-full py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition mb-3"
            >
              Resend Email
            </button>
          )}

          {/* Bottom */}
          <p className="text-sm text-gray-500 mt-4">
            Remembered your password?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </>
      )}
    </div>

  </div>
);
}