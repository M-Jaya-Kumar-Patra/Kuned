import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
{
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  targetType: {
    type: String,
    enum: ["listing", "user", "message"],
    required: true
  },

  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  reason: {
    type: String,
    enum: [
      "spam",
      "scam",
      "inappropriate",
      "fake_item",
      "harassment",
      "other"
    ],
    required: true
  },

  description: String,

  status: {
    type: String,
    enum: ["pending", "reviewing", "resolved", "rejected"],
    default: "pending"
  }

},
{ timestamps: true }
);

export default mongoose.models.Report ||
mongoose.model("Report", ReportSchema);