import mongoose, { Schema } from "mongoose";
import { IGoogleUser } from "../types/types";

const GoogleUserSchema: Schema = new Schema<IGoogleUser>(
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

export default mongoose.model<IGoogleUser>("GoogleUser", GoogleUserSchema);
