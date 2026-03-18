"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [timer, setTimer] = useState(60);

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
    <div className="max-w-md mx-auto mt-20">

      <h2 className="text-xl font-semibold mb-4">
        Forgot Password
      </h2>

      <input
        type="email"
        placeholder="Enter email"
        className="border p-2 w-full mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 w-full"
      >
        Send Reset Link
      </button>

      {/* Remember Password Button */}
      <button
        onClick={() => router.push("/login")}
        className="mt-3 text-blue-600 text-sm hover:underline w-full"
      >
        Remembered your password? Login
      </button>

      {showPopup && (

        <div className="mt-6 p-4 border rounded bg-gray-50">

          <p className="mb-3">
            Reset email sent to <strong>{email}</strong>
          </p>

          {timer > 0 ? (

            <p className="text-sm text-gray-500">
              Retry in {timer}s
            </p>

          ) : (

            <button
              onClick={handleSubmit}
              className="text-blue-600 underline text-sm"
            >
              Resend Email
            </button>

          )}

        </div>

      )}

    </div>
  );
}