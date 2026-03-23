"use client";

import { useState } from "react";
import api from "@/services/api";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function SignupContent() {
  const router = useRouter();
  const params = useSearchParams();

  const source = params.get("source");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    referralCode: ""
  });

  const [strength, setStrength] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await api.post("/auth/signup", {
        ...form,
        sourceWebsite: source || "direct"
      });

      router.push(`/verify-email?email=${form.email}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("Error:", err.response?.data);
      } else {
        console.log("Unexpected Error:", err);
      }

      alert("Signup failed");
    }
  };

  const checkPasswordStrength = (password: string) => {
  let score = 0;

  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return "Weak";
  if (score <= 4) return "Medium";
  return "Strong";
};

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#e9ecff] flex items-center justify-center px-4">

    <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-2">

      {/* ===== LEFT SIDE ===== */}
      <div className="hidden md:flex flex-col justify-center max-w-md">

        <img
          src="/images/logo_light.png"
          className="w-36 mb-6"
        />

        <h1 className="text-4xl font-semibold text-gray-800 leading-tight">
  Start your journey <br /> with Kuned
</h1>

<p className="text-gray-500 mt-3 text-lg">
  Buy, sell, and connect—anytime, anywhere
</p>

        {/* Phone Image */}
        <img
          src="/images/login/phone.png"
          className="mt-10 w-[380px]"
        />
      </div>

      {/* ===== RIGHT SIDE ===== */}
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Create account ✨
        </h2>

        <p className="text-center text-gray-500 mt-1 mb-6">
          Join <span className="font-semibold">Kuned</span> and start trading
        </p>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="mb-3">
            <input
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white/80 focus:outline-none placeholder:text-gray-400 text-gray-900"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <input
              placeholder="Email"
              className="w-full px-4 py-2 placeholder:text-gray-400 text-gray-900 rounded-lg border border-gray-200 bg-white/80 focus:outline-none"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="mb-3">
  <input
    type="password"
    placeholder="Password"
    className="w-full px-4 py-2 placeholder:text-gray-400 text-gray-900 rounded-lg border border-gray-200 bg-white/80 focus:outline-none"
    onChange={(e) => {
      const value = e.target.value;
      setForm({ ...form, password: value });
      setStrength(checkPasswordStrength(value));
    }}
  />

  {/* 🔥 Strength UI */}
  {form.password && (
    <div className="mt-2">
      
      {/* Bar */}
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

      {/* Text */}
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

          {/* Referral Code */}
          <div className="mb-4">
            <input
              placeholder="Referral Code (optional)"
              className="w-full px-4 py-2 placeholder:text-gray-400 text-gray-900 rounded-lg border border-gray-200 bg-white/80 focus:outline-none"
              onChange={(e) => setForm({ ...form, referralCode: e.target.value })}
            />
          </div>

          {/* Submit */}
          <button className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium hover:opacity-90 transition">
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-[1px] bg-gray-200"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-[1px] bg-gray-200"></div>
        </div>

        {/* Google Signup */}
        <div className=" px-4 py-2 flex justify-center hover:bg-gray-50 transition">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await api.post("/auth/google", {
                  credential: credentialResponse.credential,
                });

                const { token, user } = res.data;

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));

                router.push("/dashboard");
              } catch (err) {
                alert("Google signup failed");
              }
            }}
            onError={() => {
              alert("Google Signup Failed");
            }}
          />
        </div>

        {/* Bottom */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>


  </div>
);
}