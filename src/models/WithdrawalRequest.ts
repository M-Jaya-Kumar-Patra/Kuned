import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  amount: Number,

  bankName: String,
  accountNumber: String,
  ifsc: String,
  accountHolderName: String,

  status: {
    type: String,
    enum: ["pending", "processed", "rejected"],
    default: "pending"
  }

}, { timestamps: true });

export default mongoose.models.WithdrawalRequest ||
mongoose.model("WithdrawalRequest", withdrawalSchema);