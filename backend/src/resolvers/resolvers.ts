import { EGenreType } from "../types/types";
import {
  books,
  someBooks,
  book,
  booksByUserId,
  createBook,
  deleteBook,
  updateBook,
  someBooksByUserId,
} from "./Book";
import { users, user, loginUser, registerUser, logoutUser } from "./User";

const resolvers = {
  Query: {
    // Books
    book,
    books,
    someBooks,
    booksByUserId,
    someBooksByUserId,
    // Users
    users,
    user,
  },

  Mutation: {
    // Users
    registerUser,
    loginUser,
    logoutUser,

    // Books
    createBook,
    deleteBook,
    updateBook,
  },

  // Enum type for create book's genre
  EGenreType: {
    Fiction: EGenreType.Fiction,
    Nonfiction: EGenreType.Nonfiction,
    Drama: EGenreType.Drama,
    Poetry: EGenreType.Poetry,
    Folktale: EGenreType.Folktale,
  },
};

export default resolvers;
