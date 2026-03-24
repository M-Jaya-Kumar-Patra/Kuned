"use client";

import { useEffect, useState } from "react";

export default function BetaNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
  const seen = localStorage.getItem("beta_seen");

  if (!seen) {
    setTimeout(() => {
      setShow(true);
    }, 0);
  }
}, []);

  const handleClose = () => {
    localStorage.setItem("beta_seen", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
  <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-6 max-w-md text-center shadow-xl">
    
    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
      🚧 Beta Version
    </h2>

    <p className="text-gray-600 text-lg mb-5 leading-relaxed">
      This platform is currently in beta. Some features may not work as expected.
      We appreciate your feedback and support while we improve the experience.
    </p>

    <button
      onClick={handleClose}
      className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white text-lg cursor-pointer px-5 py-2 rounded-lg font-medium hover:opacity-90 transition"
    >
      Got it 👍
    </button>

  </div>
</div>
  );
}