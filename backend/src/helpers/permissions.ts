import { and, rule, shield } from "graphql-shield";
import Book from "../models/Book";

const isAuthenticated = rule()(async (parent, args, { req }) => {
  return req.user !== undefined;
});

const isAdmin = rule()(async (parent, args, { req }) => {
  return req.user.isAdmin;
});

const isBookOwnToUser = rule()(async (parent, args, { req }) => {
  const book = await Book.findById({ _id: args._id });
  return book!.user === req.user._id;
});

export default shield({
  Query: {
    book: isAuthenticated,
    books: isAuthenticated,
    booksByUserId: isAuthenticated,
    users: and(isAuthenticated, isAdmin),
    user: and(isAuthenticated, isAdmin),
  },

  Mutation: {
    createBook: isAuthenticated,
    deleteBook: and(isAuthenticated, isBookOwnToUser),
    updateBook: and(isAuthenticated, isBookOwnToUser),
  },
});
