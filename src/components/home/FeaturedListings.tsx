import ListingCard from "@/components/ListingCard";
import type { Listing } from "@/types/listing";

type Props = {
  listings: Listing[];
};

export default function FeaturedListings({ listings }: Props) {

  const featured = listings.slice(0, 6);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Featured Listings</h2>
        <button className="text-blue-600">View All</button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {featured.map((item) => (
          <ListingCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}