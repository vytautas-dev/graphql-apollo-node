import mongoose, { Schema } from "mongoose";
import { IBlackList } from "../types/types";

const TokensBlackListSchema: Schema<IBlackList> = new Schema({
  token: { type: String, required: true, unique: true },
  expireAt: { type: Date, expires: 3600 },
});

export default mongoose.model<IBlackList>("BlackList", TokensBlackListSchema);
