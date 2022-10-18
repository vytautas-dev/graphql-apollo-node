import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export interface IRegisterInput {
  registerInput: IUser;
}

export interface ILoginInput {
  loginInput: IUser;
}

export enum EGenreType {
  Fiction = "fiction",
  Nonfiction = "nonfiction",
  Drama = "drama",
  Poetry = "poetry",
  Folktale = "folktale",
}

export interface IBook extends Document, TPaginationInput {
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

export interface TPaginationInput {
  limit: number;
  offset: number;
}
