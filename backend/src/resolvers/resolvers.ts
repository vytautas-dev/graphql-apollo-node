import User from "../models/User";
import Book from "../models/Book";
import { EGenreType, IBook, IBookInput, IUser } from "../types/types";

const resolvers = {
  Query: {
    async book<T>(parent: T, args: IBook) {
      return Book.findById(args._id);
    },
    async books() {
      return Book.find();
    },
    async booksByUserId<T>(parent: T, args: IBook) {
      return Book.find(args.user);
    },
    async users() {
      return User.find();
    },
    async user<T>(parent: T, args: IUser) {
      return User.findById(args._id);
    },
    async login() {},
  },

  Mutation: {
    async createBook<T>(
      parent: T,
      { bookInput: { user, author, title, description, genre } }: IBookInput
    ) {
      const book = new Book({
        user,
        author,
        title,
        description,
        genre,
      });
      return book.save();
    },
  },

  // Genre type for create a book
  EGenreType: {
    Fiction: EGenreType.Fiction,
    Nonfiction: EGenreType.Nonfiction,
    Drama: EGenreType.Drama,
    Poetry: EGenreType.Poetry,
    Folktale: EGenreType.Folktale,
  },
};

export default resolvers;
