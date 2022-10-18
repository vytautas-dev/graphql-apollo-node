import User from "../models/User";
import { GraphQLError } from "graphql";
import {
  registerValidateSchema,
  loginValidateSchema,
} from "../validateSchemas/User";
import { ILoginInput, IRegisterInput, IUser } from "../types/types";
import "dotenv/config";
import { validPassword } from "../helpers/validPassword";

//Queries
export const users = async () => {
  return User.find();
};

export const user = async <T>(parent: T, args: IUser) => {
  return User.findById(args._id);
};

//Mutations
export const registerUser = async <T>(
  parent: T,
  { registerInput: { username, email, password } }: IRegisterInput
) => {
  try {
    await registerValidateSchema.validateAsync({
      username,
      email,
      password,
    });
  } catch (err: any) {
    return new GraphQLError(`${err.details[0].message}`);
  }

  const userExists = await User.findOne({ email });
  if (userExists) console.log("User exists");

  const user = await new User({ username, email, password });
  return user.save();
};

export const loginUser = async <T>(
  parent: T,
  { loginInput: { email, password } }: ILoginInput,
  { req }: any
) => {
  try {
    await loginValidateSchema.validateAsync({
      email,
      password,
    });
  } catch (err: any) {
    return new GraphQLError(`${err.details[0].message}`);
  }
  const user = await User.findOne({ email });
  if (!user) return new GraphQLError(`Cannot find a User`);
  const id = user._id;
  const isAdmin = user.isAdmin;
  const isValid = await validPassword(password, user!.password);
  if (isValid) {
    req.session.userId = id;
    req.session.isAdmin = isAdmin;
    req.session.isAuth = true;
    return true;
  }
};

export const logoutUser = async <T>(parent: T, args: T, { req }: any) => {
  if (req.session)
    req.session.destroy((err: any) => {
      return new GraphQLError(err);
    });
};
