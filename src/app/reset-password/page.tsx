"use client";

import { Suspense } from "react";
import ResetPasswordContent from "./ResetPasswordContent";
import Loader from "@/components/ui/Loader";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loader/>}>
      <ResetPasswordContent />
    </Suspense>
  );
}