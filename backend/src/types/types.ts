import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  token: string;
}

export enum EGenreType {
  Fiction = "fiction",
  Nonfiction = "nonfiction",
  Drama = "drama",
  Poetry = "poetry",
  Folktale = "folktale",
}

export interface IBook extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  author: string;
  title: string;
  description: string;
  genre: EGenreType;
}

export interface IBookInput extends IBook {
  bookInput: IBook;
}
