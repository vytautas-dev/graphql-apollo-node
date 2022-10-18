import { EGenreType } from "../types/types";
import {
  books,
  book,
  booksByUserId,
  createBook,
  deleteBook,
  updateBook,
} from "./Book";
import { users, user, loginUser, registerUser, logoutUser } from "./User";

const resolvers = {
  Query: {
    // Books
    book,
    books,
    booksByUserId,

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
