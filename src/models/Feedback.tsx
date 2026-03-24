import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    message: String,
    type: {
      type: String,
      enum: ["bug", "suggestion"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Feedback ||
  mongoose.model("Feedback", FeedbackSchema);