"use client";

import { Suspense } from "react";
import SignupContent from "./SignupContent";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}