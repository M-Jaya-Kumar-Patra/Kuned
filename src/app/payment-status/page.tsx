"use client";

import { Suspense } from "react";
import PaymentStatusContent from "./PaymentStatusContent";

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentStatusContent />
    </Suspense>
  );
}