"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import api from "@/services/api";
import { AuthContext } from "@/context/AuthContext";

const reasons = [
  { key: "spam", label: "Spam", icon: "🚫" },
  { key: "scam", label: "Scam", icon: "⚠️" },
  { key: "fake_item", label: "Fake Item", icon: "❌" },
  { key: "inappropriate", label: "Inappropriate Content", icon: "🚷" },
  { key: "harassment", label: "Harassment", icon: "❗" },
  { key: "other", label: "Other", icon: "❓" },
];

export default function ReportContent() {
  const params = useSearchParams();
  const router = useRouter();
  const auth = useContext(AuthContext);

  const listingId = params.get("listing");

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
  if (!auth?.user) {
    router.push("/login");
  }
}, [auth?.user]);

  const submitReport = async () => {
    if (!listingId) return alert("Invalid listing");
    if (!reason) return alert("Please select a reason");

    try {
      setLoading(true);

      await api.post("/report", {
        targetType: "listing",
        targetId: listingId,
        reason,
        description,
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#e9ecff] flex items-center justify-center px-4">

      {/* CARD */}
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">

        {!submitted ? (
          <>
            {/* HEADER */}
            <div className="text-center mb-6">
              <div className="text-5xl mb-2">🔔</div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Report Listing
              </h2>
              <p className="text-gray-500 text-sm">
                Help us keep the marketplace safe
              </p>
            </div>

            {/* REASONS */}
            <p className="text-sm font-medium text-gray-600 mb-3">
              Reason that you report
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {reasons.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setReason(r.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition text-gray-700 ${
                    reason === r.key
                      ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <span>{r.icon}</span>
                  {r.label}
                </button>
              ))}
            </div>

            {/* DESCRIPTION */}
            <p className="text-sm font-medium text-gray-600 mb-2">
              Additional details (optional)
            </p>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more details if needed..."
              className="w-full p-3 rounded-xl border placeholder:text-gray-400 text-gray-900 border-gray-200 focus:outline-none mb-5"
              rows={3}
            />

            {/* BUTTON */}
            <button
              onClick={submitReport}
              disabled={loading}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 text-white font-medium hover:opacity-90 transition"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </>
        ) : (
          <>
            {/* SUCCESS STATE */}
            <div className="text-center">
              <div className="text-5xl mb-3">✅</div>

              <h2 className="text-xl font-semibold text-gray-800">
                Report submitted successfully
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                Our team will review this shortly
              </p>

              <button
                onClick={() => router.push("/")}
                className="mt-6 px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
              >
                Go Back to Home
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}