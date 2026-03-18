"use client";

import { Suspense } from "react";
import ReportContent from "./ReportContent";

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ReportContent />
    </Suspense>
  );
}