import User from "../models/User";
import Book from "../models/Book";
import {
  EGenreType,
  IAuth,
  IBook,
  IBookInput,
  ILoginInput,
  IRegisterInput,
  IUser,
} from "../types/types";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { ApolloError } from "apollo-server";
import bcrypt from "bcrypt";
import TokensBlackList from "../models/TokensBlackList";

const validPassword = async (password: string, userPassword: string) => {
  const isValid: boolean = await bcrypt.compare(password, userPassword);
  return isValid;
};

const jwtSecret = process.env.JWT_SECRET;

const resolvers = {
  Query: {
    // Books
    async book<T>(parent: T, args: IBook, { isAuth, isAdmin }: IAuth) {
      if (!isAuth || !isAdmin) {
        throw new ApolloError("Unauthorized");
      }
      return Book.findById(args._id);
    },
    async books<T>(parent: T, args: T, { isAuth, isAdmin }: IAuth) {
      if (!isAuth || !isAdmin) {
        throw new ApolloError("Unauthorized");
      }
      return Book.find();
    },
    async booksByUserId<T>(parent: T, args: IBook, { isAuth }: IAuth) {
      if (!isAuth) {
        throw new ApolloError("Unauthorized");
      }
      return Book.find(args.user);
    },

    // Users
    async users<T>(parent: T, args: T, { isAuth, isAdmin }: IAuth) {
      if (!isAuth || !isAdmin) {
        throw new ApolloError("Unauthorized");
      }
      return User.find();
    },
    async user<T>(parent: T, args: IUser, { isAuth, isAdmin }: IAuth) {
      if (!isAuth || !isAdmin) {
        throw new ApolloError("Unauthorized");
      }
      return User.findById(args._id);
    },

    // Login User
    async loginUser<T>(
      parent: T,
      { loginInput: { email, password } }: ILoginInput
    ) {
      const user = await User.findOne({ email });
      if (!user) throw new ApolloError("User not exists");
      const id = user._id;
      const isAdmin = user.isAdmin;
      const isValid = await validPassword(password, user!.password);
      if (isValid) {
        const token = jwt.sign({ id, isAdmin }, jwtSecret, {
          algorithm: "HS256",
          expiresIn: "1d",
        });
        return { token };
      }
    },
  },

  Mutation: {
    //Register User
    async registerUser<T>(
      parent: T,
      { registerInput: { username, email, password } }: IRegisterInput
    ) {
      if (!username || !email || !password)
        throw new ApolloError("Please fill all fields");
      const userExists = await User.findOne({ email });
      if (userExists) throw new ApolloError("User already exists");

      const user = new User({ username, email, password });
      return user.save();
    },

    // Books
    async createBook<T>(
      parent: T,
      { bookInput: { user, author, title, description, genre } }: IBookInput,
      { isAuth }: IAuth
    ) {
      if (!isAuth) {
        throw new ApolloError("Unauthorized");
      }
      const book = new Book({
        user,
        author,
        title,
        description,
        genre,
      });
      return book.save();
    },
    async deleteBook<T>(parent: T, args: IBook, { isAuth }: IAuth) {
      if (!isAuth) {
        throw new ApolloError("Unauthorized");
      }
      return Book.findByIdAndDelete({ _id: args._id });
    },
    async updateBook<T>(
      parent: T,
      { _id, bookInput }: IBookInput,
      { isAuth }: IAuth
    ) {
      if (!isAuth) {
        throw new ApolloError("Unauthorized");
      }
      return Book.findByIdAndUpdate(_id, bookInput);
    },

    // Logout User
    async logoutUser<T>(parent: T, args: T, { isAuth, token }: IAuth) {
      try {
        await new TokensBlackList({ token }).save();
      } catch (err: any) {
        throw new ApolloError(err);
      }
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
