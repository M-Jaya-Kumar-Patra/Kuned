"use client";

import { Suspense } from "react";
import VerifyEmailContent from "./VerifyEmailContent";
import Loader from "@/components/ui/Loader";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Loader/>}>
      <VerifyEmailContent />
    </Suspense>
  );
}