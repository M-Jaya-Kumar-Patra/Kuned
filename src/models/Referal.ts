import mongoose from "mongoose";

const ReferralSchema = new mongoose.Schema(
{
  referrerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  referredUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  rewardGiven: {
    type: Boolean,
    default: false
  }

},
{ timestamps: true }
);

export default mongoose.models.Referral ||
mongoose.model("Referral", ReferralSchema);