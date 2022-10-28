import mongoose, { Schema } from "mongoose";
import { ISettings } from "../types/types";

const SettingsSchema: Schema<ISettings> = new Schema({
  refreshToken: { type: String, required: true },
});

export default mongoose.model("Settings", SettingsSchema);
