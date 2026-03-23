"use client";

import { useEffect, useState, useContext } from "react";
import api from "@/services/api";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { useRouter } from "next/navigation";


type Listing = {
  _id: string;
  title: string;
  price: number;
  status?: "active" | "sold";
  topListing?: boolean;
  urgentSale?: boolean;
  isHighlighted?: boolean;
  images: string[];
  slug: string;
};

type UserStats = {
  bonusCoins: number;
  paidCoins: number;
};

export default function DashboardPage() {
  const auth = useContext(AuthContext);
  const router = useRouter();

  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState<UserStats>({
    bonusCoins: 0,
    paidCoins: 0,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const user = auth?.user;

  useEffect(() => {
    if (!user) return;

    const fetchListings = async () => {
      try {
        const res = await api.get(`/profile?page=${page}&limit=10`);

        setListings(res.data.listings);
        setTotalPages(res.data.totalPages)

        setStats({
          bonusCoins: res.data.user.bonusCoins,
          paidCoins: res.data.user.paidCoins,
        });
      } catch (error) {
        console.error("Failed to fetch listings", error);
      }
    };

    fetchListings();
  }, [user, page]);

  const deleteListing = async (listingId: string) => {
    const confirmDelete = confirm("Delete this listing?");

    if (!confirmDelete) return; 

    try {
      await api.delete(`/listings/${listingId}`);

      setListings((prev) =>
        prev.filter((listing) => listing._id !== listingId),
      );
    } catch (error) {
      console.error("Failed to delete listing", error);
    }
  };

  const makeTopListing = async (listingId: string) => {
  try {
    const res = await api.post("/listings/top", { listingId });

    setListings((prev) =>
      prev.map((l) =>
        l._id === listingId ? { ...l, topListing: true } : l
      )
    );

    setStats({
      bonusCoins: res.data.bonusCoins,
      paidCoins: res.data.paidCoins
    });

  } catch (error) {
    console.error("Top listing failed", error);
    alert("Not enough coins or error occurred");
  }
};

const makeUrgentSale = async (listingId: string) => {
  try {
    const res = await api.post("/listings/urgent", { listingId });

    setListings((prev) =>
      prev.map((l) =>
        l._id === listingId ? { ...l, urgentSale: true } : l
      )
    );

    setStats({
      bonusCoins: res.data.bonusCoins,
      paidCoins: res.data.paidCoins
    });

  } catch (error) {
    console.error("Urgent sale failed", error);
    alert("Not enough coins or error occurred");
  }
};

const makeHighlightListing = async (listingId: string) => {
  try {
    const res = await api.post("/listings/highlight", { listingId });

    setListings((prev) =>
      prev.map((l) =>
        l._id === listingId ? { ...l, isHighlighted: true } : l
      )
    );

    setStats({
      bonusCoins: res.data.bonusCoins,
      paidCoins: res.data.paidCoins
    });

  } catch (error) {
    console.error("Highlight failed", error);
    alert("Not enough coins or error occurred");
  }
};

const toggleSoldStatus = async (listing: Listing) => {

  const newStatus = listing.status === "sold" ? "active" : "sold";

  await api.post("/listings/sold", {
    listingId: listing._id,
    status: newStatus
  });

  setListings(prev =>
    prev.map(l =>
      l._id === listing._id ? { ...l, status: newStatus } : l
    )
  );

};

  if (!auth) {
    return <p>Loading...</p>;
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4 flex justify-center">

    <div className="w-full max-w-5xl">

      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        My Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 shadow">
          <p className="text-sm text-gray-500">Listings</p>
          <p className="text-2xl font-bold text-gray-800">
            {listings.length}
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 shadow">
          <p className="text-sm text-gray-500">Bonus Coins</p>
          <p className="text-2xl font-bold text-yellow-600">
            🪙 {stats.bonusCoins}
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 shadow">
          <p className="text-sm text-gray-500">Paid Coins</p>
          <p className="text-2xl font-bold text-blue-600">
            💰 {stats.paidCoins}
          </p>
        </div>
      </div>

      {/* Listings */}
      <div className="flex justify-between items-center  mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
        My Listings
      </h2>
      <button onClick={()=>router.push("/create")} className="cursor-pointer bg-blue-500 p-1 px-2 rounded-lg flex justify-center items-center gap-1">
        <FaPlus />New Listing
      </button>
      </div>

      {listings.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          No listings yet 🙂
        </div>
      )}

      <div className="space-y-4">

        {listings.map((listing) => (
          <div
            key={listing._id}

            className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow hover:shadow-lg transition"
          >

            <div className="flex justify-between items-start gap-4">

              {/* Left */}
<div className="flex items-center gap-4">

  {/* Image */}
  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center">
    <img
    onClick={()=>router.push(`/item/${listing?.slug}`)}
      src={listing.images[0] || "/default-product.png"}
      alt={listing.title}
      className="w-full h-full object-cover cursor-pointer"
    />
  </div>

  {/* Info */}
  <div>
    <h3 className="font-semibold text-lg text-gray-800">
      {listing.title}
    </h3>

    <p className="text-green-600 font-semibold mt-1">
      ₹{listing.price}
    </p>

    <p className="text-xs mt-1 text-gray-400">
      Status: {listing.status || "active"}
    </p>
  </div>

</div>

              {/* Right Buttons */}
              <div className="flex flex-wrap gap-2 justify-end">

                <Link
                  href={`/edit/${listing._id}`}
                  className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteListing(listing._id)}
                  className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                >
                  Delete
                </button>

                <button
                  onClick={() => toggleSoldStatus(listing)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    listing.status === "sold"
                      ? "bg-gray-200 text-gray-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {listing.status === "sold"
                    ? "Mark Active"
                    : "Mark Sold"}
                </button>

                {/* Features */}
                {listing.topListing ? (
                  <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700">
                    ⭐ Top
                  </span>
                ) : (
                  <button
                    onClick={() => makeTopListing(listing._id)}
                    className="px-3 py-1 text-sm rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                  >
                    ⭐ Top
                  </button>
                )}

                {listing.urgentSale ? (
                  <span className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-600">
                    🚨 Urgent
                  </span>
                ) : (
                  <button
                    onClick={() => makeUrgentSale(listing._id)}
                    className="px-3 py-1 text-sm rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100"
                  >
                    🚨 Urgent
                  </button>
                )}

                {listing.isHighlighted ? (
                  <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-600">
                    🔥 Highlighted
                  </span>
                ) : (
                  <button
                    onClick={() => makeHighlightListing(listing._id)}
                    className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                  >
                    🔥 Highlight
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 rounded-full bg-white shadow disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-gray-600">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 rounded-full bg-white shadow disabled:opacity-40"
        >
          Next
        </button>
      </div>

    </div>
  </div>
);
}
