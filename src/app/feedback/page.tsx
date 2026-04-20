"use client";

import { useContext, useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";


export default function FeedbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [type, setType] = useState("bug");

  

  const handleSubmit = async () => {
  if (!message.trim()) return alert("Please enter your feedback");

  await api.post("/feedback", { message, type });

  alert("Thanks for your feedback! 🙌");
  setMessage("");

  router.back(); // 🔥 go to previous page
};

  return (
    <ProtectedRoute>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f5f7ff] to-[#eef1ff] px-4">
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-md w-full max-w-md">

        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Send Feedback
        </h1>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full mb-3 border p-2 rounded-lg  text-gray-900 placeholder:text-gray-400"
        >
          <option value="bug">🐞 Bug</option>
          <option value="suggestion">💡 Suggestion</option>
        </select>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your issue or suggestion..."
          className="w-full border p-3 rounded-lg mb-4 h-28 text-gray-900 placeholder:text-gray-400"
        />

        <button
          onClick={handleSubmit}
          className="w-full cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-500 text-white py-2 rounded-lg"
        >
          Submit Feedback
        </button>

      </div>
    </div>
    </ProtectedRoute>
  );
}