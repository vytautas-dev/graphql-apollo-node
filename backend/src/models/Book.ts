import mongoose, { Schema } from "mongoose";
import { IBook } from "../types/types";

const BookSchema: Schema = new Schema<IBook>({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: { type: String, required: true },
  genre: {
    type: String,
    enum: ["fiction", "nonfiction", "drama", "poetry", "folktale"],
  },
});

export default mongoose.model<IBook>("Book", BookSchema);
