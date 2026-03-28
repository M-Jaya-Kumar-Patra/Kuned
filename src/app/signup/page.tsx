"use client";

import { Suspense } from "react";
import SignupContent from "./SignupContent";
import Loader from "@/components/ui/Loader";

export default function SignupPage() {
  return (
    <Suspense fallback={<Loader/>}>
      <SignupContent />
    </Suspense>
  );
}