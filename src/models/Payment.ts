import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    orderId: {
        type: String,
        required: true,
        unique: true
    },

    paymentSessionId: String,

    amount: Number,

    coins: Number,

    status: {
        type: String,
        enum: ["initiated", "pending", "success", "failed"],
        default: "pending"
    }

},
{ timestamps: true }
);

export default mongoose.models.Payment ||
mongoose.model("Payment", paymentSchema);