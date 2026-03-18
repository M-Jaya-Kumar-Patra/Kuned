import mongoose from "mongoose";

const CoinTransactionSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  amount: Number,

  coinType: {
    type: String,
    enum: ["bonus", "paid"]
  },

  transactionType: {
    type: String,
    enum: ["earn", "spend"]
  },

  source: String

},
{ timestamps: true }
);

export default mongoose.models.CoinTransaction ||
mongoose.model("CoinTransaction", CoinTransactionSchema);