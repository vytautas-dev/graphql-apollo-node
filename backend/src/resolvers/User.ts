import User from "../models/User";
import { GraphQLError } from "graphql";
import {
  registerValidateSchema,
  loginValidateSchema,
} from "../validateSchemas/User";
import { ILoginInput, IRegisterInput, IUser } from "../types/types";
import "dotenv/config";
import { validPassword } from "../helpers/validPassword";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

export const userResolvers = {
  Query: {
    async users() {
      return User.find();
    },

    async user<T>(parent: T, args: IUser) {
      return User.findById(args._id);
    },
  },

  Mutation: {
    async registerUser<T>(
      parent: T,
      { registerInput: { username, email, password } }: IRegisterInput
    ) {
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
      await user.save();
      await pubsub.publish("USER_CREATED", { newUserCreated: user });
      return user;
    },

    async loginUser<T>(
      parent: T,
      { loginInput: { email, password } }: ILoginInput,
      { req }: any
    ) {
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
        console.log(req.session);
        return true;
      }
    },
    async logoutUser<T>(parent: T, args: T, { req }: any) {
      if (req.session)
        req.session.destroy((err: any) => {
          return new GraphQLError(err);
        });
      return true;
    },
  },

  Subscription: {
    newUserCreated: {
      subscribe: () => pubsub.asyncIterator(["USER_CREATED"]),
    },
  },
};
