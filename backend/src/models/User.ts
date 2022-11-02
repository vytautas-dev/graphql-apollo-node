import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/types";

const UserSchema: Schema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    googleId: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
