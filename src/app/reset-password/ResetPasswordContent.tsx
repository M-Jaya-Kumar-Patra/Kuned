"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordContent() {
  const params = useSearchParams();
  const router = useRouter();

  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState("");

  // 🔥 Password Strength
  const checkStrength = (pwd: string) => {
    let score = 0;

    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return "Weak";
    if (score <= 4) return "Medium";
    return "Strong";
  };

  const handleSubmit = async () => {
    if (!token) {
      alert("Invalid or expired link");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (strength === "Weak") {
      alert("Please choose a stronger password");
      return;
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    if (data.success) {
      localStorage.setItem("passwordResetSuccess", "true");
      alert("Password updated successfully");
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#e9ecff] flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">

        {/* HEADER */}
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Reset Password 🔐
        </h2>

        <p className="text-sm text-gray-500 text-center mt-1 mb-6">
          Enter your new password below
        </p>

        {/* PASSWORD */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => {
              const val = e.target.value;
              setPassword(val);
              setStrength(checkStrength(val));
            }}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white/80 text-gray-900 outline-none"
          />

          {/* 🔥 Strength Bar */}
          {password && (
            <div className="mt-2">
              <div className="h-2 rounded bg-gray-200 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    strength === "Weak"
                      ? "w-1/3 bg-red-500"
                      : strength === "Medium"
                      ? "w-2/3 bg-yellow-500"
                      : "w-full bg-green-500"
                  }`}
                />
              </div>

              <p
                className={`text-xs mt-1 ${
                  strength === "Weak"
                    ? "text-red-500"
                    : strength === "Medium"
                    ? "text-yellow-500"
                    : "text-green-600"
                }`}
              >
                {strength} password
              </p>
            </div>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-5">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white/80 text-gray-900 outline-none"
          />

          {/* match indicator */}
          {confirmPassword && (
            <p
              className={`text-xs mt-1 ${
                password === confirmPassword
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {password === confirmPassword
                ? "Passwords match"
                : "Passwords do not match"}
            </p>
          )}
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium hover:opacity-90 transition"
        >
          Update Password
        </button>

      </div>
    </div>
  );
}