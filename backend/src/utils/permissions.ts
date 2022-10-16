import { and, or, rule, shield } from "graphql-shield";
import { IAuth } from "../types/types";
import Book from "../models/Book";

const isAuthenticated = rule()((parent, args, { isAuth }: IAuth) => {
  return isAuth;
});

const isAdmin = rule()((parent, args, { isAdmin }: IAuth) => {
  return isAdmin;
});

const isBookOwnToUser = rule()(async (parent, args, { userId }) => {
  const book = await Book.findById({ _id: args._id });
  return book!._id === userId;
});

export default shield({
  Query: {
    book: and(isAuthenticated, isAdmin),
    books: and(isAuthenticated, isAdmin),
    booksByUserId: isAuthenticated,
    users: and(isAuthenticated, isAdmin),
    user: and(isAuthenticated, isAdmin),
  },
  Mutation: {
    createBook: isAuthenticated,
    deleteBook: and(isAuthenticated, isBookOwnToUser),
    updateBook: and(isAuthenticated, isBookOwnToUser),
    logoutUser: isAuthenticated,
  },
});
