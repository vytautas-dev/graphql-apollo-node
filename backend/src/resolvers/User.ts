import User from "../models/User";
import { userValidateSchema } from "../validateSchemas/User";
import { IAuth, ILoginInput, IRegisterInput, IUser } from "../types/types";
import "dotenv/config";
import { validPassword } from "../helpers/validPassword";

//Queries
export const users = async () => {
  return User.find();
};

export const user = async <T>(parent: T, args: IUser) => {
  return User.findById(args._id);
};

export const loginUser = async <T>(
  parent: T,
  { loginInput: { email, password } }: ILoginInput,
  { req }: any
) => {
  const user = await User.findOne({ email });
  if (!user) return console.log("Cannot find user");
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
  if (req.session) req.session.destroy((err: any) => {});
  console.log(req.session);
};

//Mutations
export const registerUser = async <T>(
  parent: T,
  { registerInput: { username, email, password } }: IRegisterInput
) => {
  const value = await userValidateSchema.validate({
    username,
    email,
    password,
  });
  if (value.error) {
    return console.log("Register error");
  }

  const userExists = await User.findOne({ email });
  if (userExists) console.log("User exists");

  const user = await new User({ username, email, password });
  return user.save();
};
