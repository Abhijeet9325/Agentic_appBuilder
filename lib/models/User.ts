import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  imageUrl?: string;
  credits: number;
  plan: "FREE" | "STARTER" | "PRO";
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
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>("User", userSchema);

export default User;