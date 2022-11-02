import User from "../models/User";
import { IUser } from "../types/types";
import "dotenv/config";
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

  Subscription: {
    newUserCreated: {
      subscribe: () => pubsub.asyncIterator(["USER_CREATED"]),
    },
  },
};
