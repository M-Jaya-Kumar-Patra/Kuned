"use client";

import { Suspense } from "react";
import ResetPasswordContent from "./ResetPasswordContent";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="mt-20 text-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}