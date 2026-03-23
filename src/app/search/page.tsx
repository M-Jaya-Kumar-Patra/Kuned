import { Suspense } from "react";
import SearchContent from "./SearchContent";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Search Listings</h1>

      <Suspense fallback={<p>Loading...</p>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}