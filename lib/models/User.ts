import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  imageUrl?: string;

  credits: number;
  plan: "FREE" | "STARTER" | "PRO";

  // Razorpay
  razorpayCustomerId?: string;
  razorpaySubscriptionId?: string;
  subscriptionStatus?: "ACTIVE" | "PENDING" | "CANCELLED" | "EXPIRED";
  subscriptionCurrentPeriodEnd?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    credits: {
      type: Number,
      default: 10,
    },

    plan: {
      type: String,
      enum: ["FREE", "STARTER", "PRO"],
      default: "FREE",
    },

    // =========================
    // Razorpay
    // =========================

    razorpayCustomerId: {
      type: String,
      default: undefined,
    },

    razorpaySubscriptionId: {
      type: String,
      default: undefined,
    },

    subscriptionStatus: {
      type: String,
      enum: ["ACTIVE", "PENDING", "CANCELLED", "EXPIRED"],
      default: undefined,
    },

    subscriptionCurrentPeriodEnd: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>("User", userSchema);

export default User;