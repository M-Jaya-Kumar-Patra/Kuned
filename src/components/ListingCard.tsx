import Link from "next/link";

type Listing = {
  _id: string;
  title: string;
  price: number;
  location: string;
  slug: string;
  images: string[];

  topListing?: boolean;
  urgentSale?: boolean;
  isHighlighted?: boolean;
  status?: "active" | "sold"; 
};

type Props = {
  item: Listing;
};

export default function ListingCard({ item }: Props) {
  if (item?.status === "sold") return null; 
  
  return (
    <Link href={`/item/${item.slug}`}>
      <div
        className={`border rounded-lg p-4 hover:shadow-lg relative
        ${item.topListing ? "border-yellow-400 border-2" : ""}
        ${item.isHighlighted ? "border-blue-800" : ""}
      `}
      >

        {/* Tags */}
        <div className="absolute top-2 left-2 flex gap-2 flex-wrap">

          {item.topListing && (
            <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded font-semibold">
              ⭐ TOP
            </span>
          )}

          {item.urgentSale && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold">
              🚨 URGENT
            </span>
          )}

          {item.isHighlighted && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-semibold">
              🔥 HIGHLIGHT
            </span>
          )}

        </div>

        {/* Image */}
        <img
          src={item.images?.[0]}
          alt={item.title}
          className="w-full h-40 object-cover rounded"
        />

        {/* Info */}
        <h3 className="font-semibold mt-2">{item.title}</h3>

        <p className="text-green-600 font-bold">₹{item.price}</p>

        <p className="text-sm text-gray-500">{item.location}</p>

      </div>
    </Link>
  );
}