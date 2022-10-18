import { IAuth, IBook, IBookInput } from "../types/types";
import Book from "../models/Book";
import { createAndUpdateBookValidateSchema } from "../validateSchemas/Book";
import { GraphQLError } from "graphql/index";

//Queries
export const book = async <T>(parent: T, args: IBook) => {
  return Book.findById(args._id);
};

export const books = async () => {
  return Book.find();
};

export const booksByUserId = async <T>(parent: T, args: IBook) => {
  return Book.find({ user: args.user });
};

//Mutations
export const createBook = async <T>(
  parent: T,
  { bookInput: { user, author, title, description, genre } }: IBookInput,
  { req }: any
) => {
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
};

export const deleteBook = async <T>(parent: T, args: IBook) => {
  return Book.findByIdAndDelete({ _id: args._id });
};

export const updateBook = async <T>(
  parent: T,
  { _id, author, title, description, genre }: IBookInput
) => {
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
};
