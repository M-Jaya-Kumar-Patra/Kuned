import { Suspense } from "react";
import SearchContent from "./SearchContent";
import Loader from "@/components/ui/Loader";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#e9ecff]">
      
      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-2  sm:py-8">
        
        <h1 className="text-2xl font-semibold text-gray-800 mb-2 sm:mb-6">
          Search Listings
        </h1>

        <Suspense fallback={<Loader/>}>
          <SearchContent />
        </Suspense>

      </div>
    </div>
  );
}