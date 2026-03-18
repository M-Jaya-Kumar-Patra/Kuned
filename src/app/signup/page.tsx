"use client";

import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function SignupPage() {

  const router = useRouter();
  const params = useSearchParams();

const source = params.get("source");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    referralCode: ""
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
try{
  
  await api.post("/auth/signup", {
    ...form,
    sourceWebsite: source || "direct"
  });

  router.push(`/verify-email?email=${form.email}`);
}catch (err) {

  if (axios.isAxiosError(err)) {
    console.log("Google Error:", err.response?.data);
  } else {
    console.log("Unexpected Error:", err);
  }

  alert("Google login failed");
}
};
  return (
    <div className="flex justify-center items-center h-screen">

      <form
        onSubmit={handleSubmit}
        className="w-96 p-6 border rounded-lg"
      >

        <h2 className="text-xl font-bold mb-4">
          Signup
        </h2>

        <input
          placeholder="Name"
          className="w-full border p-2 mb-3"
          onChange={(e)=>setForm({...form,name:e.target.value})}
        />

        <input
          placeholder="Email"
          className="w-full border p-2 mb-3"
          onChange={(e)=>setForm({...form,email:e.target.value})}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3"
          onChange={(e)=>setForm({...form,password:e.target.value})}
        />

        <input
          placeholder="Referral Code"
          className="w-full border p-2 mb-3"
          onChange={(e)=>setForm({...form,referralCode:e.target.value})}
        />

        <button className="bg-black text-white w-full p-2">
  Create Account
</button>

<div className="text-center my-3">OR</div>

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
      console.log(err);
      alert("Google signup failed");
    }
  }}
  onError={() => {
    alert("Google Signup Failed");
  }}
/>

      </form>

    </div>
  );
}