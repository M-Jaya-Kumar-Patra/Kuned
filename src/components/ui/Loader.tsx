"use client";

export default function Loader({
  text = "Loading...",
}: {
  text?: string;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#e9ecff] w-full h-[60vh] flex flex-col items-center justify-center text-center">
      
      {/* Logo */}
      <img
        src="/images/logo_light.png"
        alt="Kuned"
        className="w-40 mb-4 animate-pulse"
      />

      {/* Text */}
      <p className="text-gray-500 text-sm">
        {text}
      </p>
    </div>
  );
}