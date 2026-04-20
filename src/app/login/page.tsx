"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import CircularLoader from "@/components/ui/CircularLoader";


export default function LoginPage() {
  const router = useRouter();
  const {login} = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
const [googleLoading, setGoogleLoading] = useState(false);

  


  const handleLogin = async () => {
  try {
    setLoading(true);

    const res = await api.post("/auth/login", {
      email,
      password,
    });

    const { user } = res.data;

    login(user);
    router.push("/dashboard");

  } catch (error: unknown) {

    if (axios.isAxiosError(error)) {
      if (error.response?.data?.emailVerificationRequired) {
        router.push(`/verify-email?email=${error.response.data.email}`);
        return;
      }
    }

    alert("Invalid credentials");
  } finally {
    setLoading(false);
  }
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
          Buy & Sell <br /> Anything, Anytime
        </h1>

        <p className="text-gray-500 mt-3 text-lg">
          Join a fast and secure marketplace
        </p>

        {/* Phone Image */}
        <img
          src="/images/login/phone.png"
          className="mt-10 w-80"
        />
      </div>

      {/* ===== RIGHT SIDE ===== */}
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg">

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Welcome back 👋
        </h2>

        <p className="text-center text-gray-500 mt-1 mb-6">
          Login to continue to <span className="font-semibold">Kuned</span>
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-4 py-2 rounded-lg border  placeholder:text-gray-400 text-gray-900 border-gray-200 bg-white/80 focus:outline-none"
          />
        </div>

        {/* Password */}
        <div className="mb-2">
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-4 py-2 rounded-lg border  placeholder:text-gray-400 text-gray-900 border-gray-200 bg-white/80 focus:outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end text-sm mb-4">
          <button
            onClick={() => router.push("/forgot-password")}
            className="text-gray-500 hover:underline"
          >
            Forgot Password?
          </button>

        </div>

        {/* Login Button */}
        <button
  onClick={handleLogin}
  disabled={loading}
  className={`w-full py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition
    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-500 to-blue-500 hover:opacity-90"}
  `}
>
  {loading ? <CircularLoader size={18} /> : "Login"}
</button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-[1px] bg-gray-200"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-[1px] bg-gray-200"></div>
        </div>

        {/* Google Login */}
        <div className="relative flex justify-center">

  {googleLoading && (
    <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-lg z-10">
      <CircularLoader size={28} />
    </div>
  )}

  <GoogleLogin
    onSuccess={async (credentialResponse) => {
      try {
        setGoogleLoading(true);

        const res = await api.post("/auth/google", {
          credential: credentialResponse.credential,
        });

        const { user } = res.data;

        login(user);
        router.push("/dashboard");

      } catch (err) {
        alert("Google login failed");
      } finally {
        setGoogleLoading(false);
      }
    }}
    onError={() => {
      alert("Google Login Failed");
    }}
  />
</div>

        {/* Bottom */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Dont have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>

  </div>
);
}
