import User from "../models/User";
import { IAuth, ILoginInput, IRegisterInput, IUser } from "../types/types";
import { ApolloError } from "apollo-server";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { validPassword } from "../utils/validPassword";
import TokensBlackList from "../models/TokensBlackList";

const jwtSecret = process.env.JWT_SECRET;

//Queries
export const users = async <T>(parent: T, args: T) => {
  return User.find();
};

export const user = async <T>(parent: T, args: IUser) => {
  return User.findById(args._id);
};

export const loginUser = async <T>(
  parent: T,
  { loginInput: { email, password } }: ILoginInput
) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApolloError("User not exists");
  const id = user._id;
  const isAdmin = user.isAdmin;
  const isValid = await validPassword(password, user!.password);
  if (isValid) {
    const token = jwt.sign({ id, isAdmin }, jwtSecret, {
      algorithm: "HS256",
      expiresIn: "1d",
    });
    return { token };
  }
};

//Mutations
export const registerUser = async <T>(
  parent: T,
  { registerInput: { username, email, password } }: IRegisterInput
) => {
  if (!username || !email || !password)
    throw new ApolloError("Please fill all fields");
  const userExists = await User.findOne({ email });
  if (userExists) throw new ApolloError("User already exists");

  const user = new User({ username, email, password });
  return user.save();
};

export const logoutUser = async <T>(parent: T, args: T, { token }: IAuth) => {
  try {
    await new TokensBlackList({ token }).save();
  } catch (err: any) {
    throw new ApolloError(err);
  }
};
