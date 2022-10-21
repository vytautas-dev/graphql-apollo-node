import {
  EGenreType,
  ESortType,
  IBook,
  IBookInput,
  TPaginationInput,
} from "../types/types";
import Book from "../models/Book";
import { createAndUpdateBookValidateSchema } from "../validateSchemas/Book";
import { GraphQLError } from "graphql/index";
import { PubSub, withFilter } from "graphql-subscriptions";

const pubsub = new PubSub();

export const bookResolvers = {
  Query: {
    async book<T>(parent: T, args: IBook) {
      return Book.findById(args._id);
    },

    async books<T>(parent: T, { bookInput }: IBookInput) {
      const { author, title, description, genre, offset, limit, sort } =
        bookInput;

      let filteredInputs: IBookInput | {} = {};
      const reduce = Object.keys({ author, title, description, genre }).reduce(
        function (acc, key) {
          return (filteredInputs = {
            ...acc,
            [key]: {
              $regex: bookInput[key as keyof typeof bookInput] || "",
              $options: "i",
            },
          });
        },
        {}
      );

      return Book.find(filteredInputs)
        .sort({ createdAt: sort })
        .skip(offset)
        .limit(limit);
    },

    async booksByUserId<T>(parent: T, { user, limit, offset }: IBookInput) {
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
      await book.save();
      await pubsub.publish("BOOK_CREATED", { newBookCreated: book });
      return book;
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

  ESortType: {
    Latest: ESortType.Latest,
    Oldest: ESortType.Oldest,
  },

  Subscription: {
    newBookCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["BOOK_CREATED"]),
        (payload, variables) => {
          return payload.newBookCreated.genre === variables.genre;
        }
      ),
    },
  },
};
