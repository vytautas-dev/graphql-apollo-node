import { IAuth, IBook, IBookInput } from "../types/types";
import Book from "../models/Book";

//Queries
export const book = async <T>(parent: T, args: IBook) => {
  return Book.findById(args._id);
};

export const books = async () => {
  return Book.find();
};

export const booksByUserId = async <T>(parent: T, args: IBook) => {
  return Book.find(args.user);
};

//Mutations
export const createBook = async <T>(
  parent: T,
  { bookInput: { user, author, title, description, genre } }: IBookInput
) => {
  const book = new Book({
    user,
    author,
    title,
    description,
    genre,
  });
  return book.save();
};

export const deleteBook = async <T>(
  parent: T,
  args: IBook,
  { userId }: IAuth
) => {
  return Book.findByIdAndDelete({ _id: args._id });
};

export const updateBook = async <T>(
  parent: T,
  { _id, bookInput }: IBookInput
) => {
  return Book.findByIdAndUpdate(_id, bookInput);
};
