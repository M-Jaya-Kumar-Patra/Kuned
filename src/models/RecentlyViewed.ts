import mongoose from "mongoose";

const recentlyViewedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true
    }
  },
  { timestamps: true }
);

recentlyViewedSchema.index(
  { userId: 1, listingId: 1 },
  { unique: true }
);

export default mongoose.models.RecentlyViewed ||
  mongoose.model("RecentlyViewed", recentlyViewedSchema);