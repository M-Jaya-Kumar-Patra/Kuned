import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
{
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation"
  },

  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  text: {
    type: String,
    required: true
  },

  delivered: {
    type: Boolean,
    default: false
  },

  seen: {
    type: Boolean,
    default: false
  }

},
{ timestamps: true }
);

export default mongoose.models.Message ||
mongoose.model("Message", MessageSchema);