"use client";

import { useEffect, useState, useContext } from "react";
import api from "@/services/api";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";

type Listing = {
  _id: string;
  title: string;
  price: number;
  status?: "active" | "sold";
  topListing?: boolean;
  urgentSale?: boolean;
  isHighlighted?: boolean;
};

type UserStats = {
  bonusCoins: number;
  paidCoins: number;
};

export default function DashboardPage() {
  const auth = useContext(AuthContext);

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
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="border p-4 rounded">
          <p className="text-gray-500 text-sm">Listings</p>
          <p className="text-xl font-bold">{listings.length}</p>
        </div>

        <div className="border p-4 rounded">
          <p className="text-gray-500 text-sm">Bonus Coins</p>
          <p className="text-xl font-bold">{stats.bonusCoins}</p>
        </div>

        <div className="border p-4 rounded">
          <p className="text-gray-500 text-sm">Paid Coins</p>
          <p className="text-xl font-bold">{stats.paidCoins}</p>
        </div>
      </div>
      <h2 className="text-lg mb-4">My Listings</h2>

      {listings.length === 0 && <p>No listings yet.</p>}

      {listings.map((listing) => (
        <div key={listing._id} className="border p-4 mb-3 rounded hover:shadow">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold text-lg">{listing.title}</h3>

              <p className="text-green-600 font-medium">₹{listing.price}</p>
            </div>

          <div className="flex gap-3 items-center">

  <Link href={`/edit/${listing._id}`} className="text-blue-600">
    Edit
  </Link>

  <button
    onClick={() => deleteListing(listing._id)}
    className="text-red-600"
  >
    Delete
  </button>

  <button
  onClick={() => toggleSoldStatus(listing)}
  className={
    listing.status === "sold"
      ? "text-gray-500"
      : "text-green-600"
  }
>
{listing.status === "sold" ? "↩ Mark Active" : "✔ Mark Sold"}
</button>

  {listing.topListing ? (
    <span className="text-yellow-600 font-semibold">
      ⭐ Top Listing
    </span>
  ) : (
    <button
      onClick={() => makeTopListing(listing._id)}
      className="text-yellow-600"
    >
      ⭐ Top (5 coins)
    </button>
  )}

  {listing.urgentSale ? (
    <span className="text-orange-600 font-semibold">
      🚨 Urgent
    </span>
  ) : (
    <button
      onClick={() => makeUrgentSale(listing._id)}
      className="text-orange-600"
    >
      🚨 Urgent (2 coins)
    </button>
  )}

  {listing.isHighlighted ? (
    <span className="text-blue-600 font-semibold">
      🔥 Highlighted
    </span>
  ) : (
    <button
      onClick={() => makeHighlightListing(listing._id)}
      className="text-blue-600"
    >
      🔥 Highlight (3 coins)
    </button>
  )}

</div>
          </div>
        </div>
      ))}
      <div className="flex gap-3 mt-6">

  <button
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
    className="border px-3 py-1"
  >
    Previous
  </button>

  <span>
    Page {page} of {totalPages}
  </span>

  <button
    disabled={page === totalPages}
    onClick={() => setPage(page + 1)}
    className="border px-3 py-1"
  >
    Next
  </button>

</div>
    </div>
  );
}
