export type Listing = {
  _id: string;
  title: string;
  price: number;
  location: string;
  slug: string;
  images: string[];
  topListing?: boolean;
  urgentSale?: boolean;
  isHighlighted?: boolean;
  status: "active" | "sold";
};