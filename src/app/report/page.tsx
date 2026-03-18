"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/services/api";

export default function ReportPage() {

  const params = useSearchParams();
  const router = useRouter();

  const listingId = params.get("listing");

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReport = async () => {

  if (!listingId) {
    alert("Invalid listing");
    return;
  }

  if (!reason) {
    alert("Please select a reason");
    return;
  }

  try {

    setLoading(true);

    console.log("Listing ID:", listingId);

    await api.post("/report", {
      targetType: "listing",
      targetId: listingId,
      reason,
      description
    });

    alert("Report submitted successfully");

    router.push("/");

  } catch (err) {

    console.error(err);
    alert("Failed to submit report", );

  } finally {

    setLoading(false);

  }

};
  return (

    <div className="max-w-lg mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Report Listing
      </h1>

      <label className="block mb-2 font-medium">
        Reason
      </label>

      <select
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="border w-full p-2 rounded"
      >
        <option value="">Select reason</option>

        <option value="spam">Spam</option>
        <option value="scam">Scam</option>
        <option value="fake_item">Fake Item</option>
        <option value="inappropriate">Inappropriate Content</option>
        <option value="harassment">Harassment</option>
        <option value="other">Other</option>

      </select>

      <label className="block mt-4 mb-2 font-medium">
        Description (optional)
      </label>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border w-full p-2 rounded"
        rows={4}
      />

      <button
        onClick={submitReport}
        disabled={loading}
        className="bg-red-500 text-white px-6 py-2 mt-4 rounded"
      >
        {loading ? "Submitting..." : "Submit Report"}
      </button>

    </div>

  );

}