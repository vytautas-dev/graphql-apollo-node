import {
  EGenreType,
  IBook,
  IBookInput,
  TPaginationInput,
} from "../types/types";
import Book from "../models/Book";
import { createAndUpdateBookValidateSchema } from "../validateSchemas/Book";
import { GraphQLError } from "graphql/index";

export const bookResolvers = {
  Query: {
    async book<T>(parent: T, args: IBook) {
      return Book.findById(args._id);
    },

    async books() {
      return Book.find();
    },

    async someBooks<T>(parent: T, { limit, offset }: TPaginationInput) {
      return Book.find().skip(offset).limit(limit);
    },

    async booksByUserId<T>(parent: T, args: IBook) {
      return Book.find({ user: args.user });
    },

    async someBooksByUserId<T>(parent: T, { user, limit, offset }: IBook) {
      return Book.find({ user }).skip(offset).limit(limit);
    },
  },

  Mutation: {
    async createBook<T>(
      parent: T,
      { bookInput: { user, author, title, description, genre } }: IBookInput,
      { req }: any
    ) {
      try {
        await createAndUpdateBookValidateSchema.validateAsync({
          author,
          title,
          description,
          genre,
        });
      } catch (err: any) {
        return new GraphQLError(`${err.details[0].message}`);
      }
      const book = new Book({
        user: req.session.userId,
        author,
        title,
        description,
        genre,
      });
      return book.save();
    },

    async deleteBook<T>(parent: T, args: IBook) {
      return Book.findByIdAndDelete({ _id: args._id });
    },

    async updateBook<T>(
      parent: T,
      { _id, author, title, description, genre }: IBookInput
    ) {
      try {
        await createAndUpdateBookValidateSchema.validateAsync({
          author,
          title,
          description,
          genre,
        });
      } catch (err: any) {
        return new GraphQLError(`${err.details[0].message}`);
      }
      return Book.findByIdAndUpdate(_id, { author, title, description, genre });
    },
  },

  EGenreType: {
    Fiction: EGenreType.Fiction,
    Nonfiction: EGenreType.Nonfiction,
    Drama: EGenreType.Drama,
    Poetry: EGenreType.Poetry,
    Folktale: EGenreType.Folktale,
  },
};
