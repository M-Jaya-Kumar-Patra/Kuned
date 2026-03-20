import ListingCard from "@/components/ListingCard";

export default function DealsSection({ listings }: any) {

  const urgent = listings.filter((l: any) => l.urgentSale).slice(0, 6);
  const latest = listings.slice(0, 6);

  return (
    <div className="grid grid-cols-2 gap-6">

      {/* Urgent */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold text-red-500">Urgent Deals</h3>
          <button className="text-blue-600">View All</button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {urgent.map((item: any) => (
            <ListingCard key={item._id} item={item} />
          ))}
        </div>
      </div>

      {/* Latest */}
      <div>
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold">Latest Listings</h3>
          <button className="text-blue-600">View All</button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {latest.map((item: any) => (
            <ListingCard key={item._id} item={item} />
          ))}
        </div>
      </div>

    </div>
  );
}