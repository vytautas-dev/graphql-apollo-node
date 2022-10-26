import { bookResolvers } from "./Book";
import { userResolvers } from "./User";
import { calendarResolvers } from "./Calendar";

export const resolvers = [bookResolvers, userResolvers, calendarResolvers];
