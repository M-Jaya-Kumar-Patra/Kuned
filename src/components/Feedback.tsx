"use client";
import { useState } from "react";
import api from "@/services/api";

export default function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("bug");

  const handleSubmit = async () => {
    if (!message.trim()) return alert("Please enter feedback");

    await api.post("/feedback", { message, type });

    alert("Thanks for your feedback! 🙌");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-xl w-[350px]">
        <h2 className="font-semibold mb-3">Send Feedback</h2>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full mb-3 border p-2 rounded"
        >
          <option value="bug">🐞 Bug</option>
          <option value="suggestion">💡 Suggestion</option>
        </select>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your issue or idea..."
          className="w-full border p-2 rounded mb-3"
        />

        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
        >
          Submit
        </button>
      </div>
    </div>
  );
}