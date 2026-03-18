import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
  },
  { timestamps: true }
);

// prevent duplicate saves
wishlistSchema.index({ userId: 1, listingId: 1 }, { unique: true });

export default mongoose.models.Wishlist ||
  mongoose.model("Wishlist", wishlistSchema);