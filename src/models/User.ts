import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: false,
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    avatar: {
      type: String,
      default: "",
    },

    bonusCoins: {
      type: Number,
      default: 15,
    },

    paidCoins: {
      type: Number,
      default: 0,
    },

    referralCode: {
      type: String,
      unique: true,
    },

    referredBy: {
      type: String,
      default: null,
    },

    sourceWebsite: {
      type: String,
      default: null,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    banned: {
      type: Boolean,
      default: false,
    },
    trustScore: {
      type: Number,
      default: 50,
    },

    totalSales: {
      type: Number,
      default: 0,
    },

    totalReports: {
      type: Number,
      default: 0,
    },
    passwordResetToken: {
      type: String,
    },

    passwordResetExpires: {
      type: Date,
    },
    verificationPin: String,
    verificationPinExpires: Date,
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
