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


async function getListing(slug: string) {
  
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/listings/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;


  return res.json();
}
export default async function ItemPage({
  params
}: {
  params: { slug: string };
}) {

  const { slug } = await params;
  console.log("Slug param:", slug);

  const listing = await getListing(slug);


  if (!listing) return notFound();


  return (
    <div>
<TrackView listingId={listing._id.toString()} />


      <Navbar />

      <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10">

        {/* Image */}

        <div>
          <ImageGallery images={listing.images} />
        </div>

        {/* Info */}

        <div>

          <div className="flex items-center gap-3 mb-2">

  {listing.topListing && (
    <span className="bg-yellow-400 text-black text-xs px-3 py-1 rounded-full font-semibold">
      ⭐ TOP LISTING
    </span>
  )}

  {listing.urgentSale && (
    <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
      🚨 URGENT
    </span>
  )}

  {listing.highlight && (
    <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
      🔥 HIGHLIGHT
    </span>
  )}

</div>
<p className="text-gray-500 text-sm">
👁 {listing.views} views
</p>

<h1 className="text-3xl font-bold">
  {listing.title}
</h1>

          <p className="text-gray-500 mt-1">
            {listing.location}
          </p>

          <p className="text-3xl font-bold mt-4 text-green-600 tracking-tight">
            ₹{listing.price}
          </p>

{listing.status === "sold" && (
  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
    SOLD
  </span>
)}
          <p className="mt-6 text-gray-700">
            {listing.description}
          </p>

          <div className="mt-8 border-t pt-4">

            <h2 className="font-semibold">
              Seller
            </h2>

            <Link
  href={`/api/seller/${listing.sellerId._id}`}
  className="text-blue-600 hover:underline"
>
  {listing.sellerId?.name}
</Link>

          </div>

          {/* Buttons */}

          <div className="mt-6 flex gap-4">

{listing.sellerId?._id && (
  <>
    <ListingActions
      listingId={listing._id}
      sellerId={listing.sellerId._id}
    />

    <SaveListingButton
      listingId={listing._id.toString()}
    />
  </>
)}

</div>

        </div>
        

      </div>
<SimilarProducts listingId={listing._id.toString()} />

<RecentlyViewed/>

    </div>
  );
}