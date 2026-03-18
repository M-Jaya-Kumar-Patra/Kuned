"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";



export default function LoginPage() {
  const router = useRouter();
  const auth = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!auth) return null;

  const { login } = auth;

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      login(user, token);

      router.push("/dashboard");
    } catch (error: unknown) {

  if (axios.isAxiosError(error)) {

    if (error.response?.data?.emailVerificationRequired) {
      router.push(`/verify-email?email=${error.response.data.email}`);
      return;
    }

  }

  alert("Invalid credentials");
}
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Forgot Password Link */}
      <div className="flex justify-between mb-4">
        <button
          onClick={() => router.push("/forgot-password")}
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot Password?
        </button>
         <button
          onClick={() => router.push("/signup")}
          className="text-sm text-blue-600 hover:underline"
        >
          Sign up?
        </button>
      </div>

      <button
        onClick={handleLogin}
        className="bg-black text-white px-4 py-2 w-full"
      >
        Login
      </button>

      <div className="mt-4">
  <GoogleLogin
    onSuccess={async (credentialResponse) => {
      try {
        const res = await api.post("/auth/google", {
          credential: credentialResponse.credential,
        });

        const { token, user } = res.data;

        login(user, token); // 🔥 SAME function

        router.push("/dashboard");
      } catch (err) {
        console.log(err);
        alert("Google login failed");
      }
    }}
    onError={() => {
      alert("Google Login Failed");
    }}
  />
</div>


    </div>
  );
}
