import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import ChatButton from "@/components/ChatButton";
import ImageGallery from "@/components/ImageGallery";
import SimilarProducts from "./SimilarProducts";

import ListingActions from "./ListingActions";
import SaveListingButton from "@/components/SaveListingButton";
import TrackView from "@/components/TrackView";
import RecentlyViewed from "@/components/ReccentlyViewed";
import Link from "next/link";


type Specification = {
  key: string;
  value: string;
};

async function getListing(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/listings/${slug}`,
    { cache: "no-store" },
  );

  if (!res.ok) return null;

  return res.json();
}
export default async function ItemPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  const listing = await getListing(slug);

  if (!listing) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#e9ecff]">
      <TrackView listingId={listing._id.toString()} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* LEFT → IMAGE */}
          <div className="bg-white/60 backdrop-blur-xl p-4 rounded-2xl shadow-sm">
            <ImageGallery images={listing.images} />
          </div>

          {/* RIGHT → INFO */}
          <div>
            {/* BADGES */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {listing.topListing && (
                <span className="bg-yellow-400/90 text-black text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
                  TOP LISTING
                </span>
              )}

              {listing.urgentSale && (
                <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
                  URGENT
                </span>
              )}

              {listing.highlight && (
                <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
                  HIGHLIGHT
                </span>
              )}
              {listing.condition && (
  <span
    className={`
      text-xs px-3 py-1 rounded-full font-semibold shadow-sm capitalize
      ${
        listing.condition !== "new"
          ? "bg-green-500 text-white"
          : listing.condition === "used"
          ? "bg-gray-500 text-white"
          : "bg-purple-500 text-white"
      }
    `}
  >
    {listing.condition}
  </span>
)}

              <span className="text-xs text-gray-500 flex items-center gap-1 ml-2">
                👁 {listing.views} views
              </span>
            </div>

            {/* TITLE */}
            <h1 className="text-3xl font-semibold text-gray-800 leading-snug">
              {listing.title}
            </h1>

            {/* LOCATION */}
            <p className="text-gray-500 text-sm mt-1">
              📍 {listing.location} • Posted 2 days ago
            </p>

            {/* DIVIDER */}
            <div className="h-[1px] bg-gray-200 my-4"></div>

            {/* PRICE */}
            <p className="text-4xl font-bold text-green-600 tracking-tight">
              ₹{listing.price}
            </p>

            {/* DESCRIPTION */}
            <p className="mt-4 text-gray-600 leading-relaxed">
              {listing.description}
            </p>

            {/* SPECIFICATIONS */}
{listing.specifications && listing.specifications.length > 0 && (
  <div className="mt-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-3">
      Specifications
    </h3>

    <div className="border rounded-xl overflow-hidden bg-white/70">
      {listing.specifications.map((spec: Specification, index: number) => (
        <div
          key={index}
          className={`flex justify-between px-4 py-3 text-lg ${
            index % 2 === 0 ? "bg-gray-50" : "bg-white"
          }`}
        >
          <span className="text-gray-600">{spec.key}</span>
          <span className="font-medium text-gray-800">
            {spec.value}
          </span>
        </div>
      ))}
    </div>
  </div>
)}

            {/* BUTTONS */}
            <div className="mt-6 flex gap-4 flex-wrap items-center">
              <ListingActions
                listingId={listing._id}
                sellerId={listing.sellerId._id}
              />

              <SaveListingButton listingId={listing._id.toString()} />
            </div>
          </div>
        </div>
      </div>

      {/* SIMILAR */}
      <SimilarProducts listingId={listing._id.toString()} />

      {/* RECENT */}
      <RecentlyViewed />
    </div>
  );
}
