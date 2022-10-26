import { and, rule, shield } from "graphql-shield";
import Book from "../models/Book";

const isAuthenticated = rule()(async (parent, args, { req }) => {
  return req.session.isAuth;
});

const isAdmin = rule()(async (parent, args, { req }) => {
  return req.session.isAdmin;
});

const isBookOwnToUser = rule()(async (parent, args, { req }) => {
  const book = await Book.findById({ _id: args._id });
  return book!._id === req.session.userId;
});

export default shield({
  Query: {
    book: and(isAuthenticated),
    books: and(isAuthenticated),
    booksByUserId: isAuthenticated,
    users: and(isAuthenticated),
    user: and(isAuthenticated),
  },

  Mutation: {
    createBook: isAuthenticated,
    deleteBook: and(isAuthenticated, isBookOwnToUser),
    updateBook: and(isAuthenticated, isBookOwnToUser),
    logoutUser: isAuthenticated,
  },
});
