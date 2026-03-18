import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  title: String,

  message: String,

  type: {
    type: String,
    enum: ["referral", "promotion", "system", "chat"]
  },

  isRead: {
    type: Boolean,
    default: false
  }

},
{ timestamps: true }
);

export default mongoose.models.Notification ||
mongoose.model("Notification", NotificationSchema);