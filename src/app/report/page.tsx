"use client";

import { Suspense } from "react";
import ReportContent from "./ReportContent";
import Loader from "@/components/ui/Loader";

export default function ReportPage() {
  return (
    <Suspense fallback={<Loader text="Loading Report..."/>}>
      <ReportContent />
    </Suspense>
  );
}