import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  refreshToken: string;
  isAdmin: boolean;
}

// export interface IGoogleUser extends Document {
//   _id: Types.ObjectId;
//   username: string;
//   email: string;
//   googleId: string;
//   refreshToken: string;
// }

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

export enum ESortType {
  Latest = 1,
  Oldest = -1,
}

export interface IBook extends Document, TPaginationInput {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  author: string;
  title: string;
  description: string;
  genre: EGenreType;
  limit: number;
  offset: number;
  sort: ESortType;
}

export interface IBookInput extends IBook {
  bookInput: IBook;
}

export interface TPaginationInput {}
