"use client";

import { Suspense } from "react";
import PaymentStatusContent from "./PaymentStatusContent";
import Loader from "@/components/ui/Loader";

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<Loader/>}>
      <PaymentStatusContent />
    </Suspense>
  );
}