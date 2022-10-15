import { gql } from "apollo-server";

const typeDefs = gql`
  """
  User types
  """
  type User {
    _id: ID
    username: String
    email: String
    password: String
  }

  """
  Book types & inputs
  """
  enum EGenreType {
    Fiction
    Nonfiction
    Drama
    Poetry
    Folktale
  }

  type Book {
    _id: ID
    user: ID
    author: String
    title: String
    description: String
    genre: EGenreType
  }

  input BookInput {
    user: ID!
    author: String!
    title: String!
    description: String!
    genre: EGenreType!
  }

  """
  Login input
  """
  input LoginInput {
    email: String
    password: String
  }

  type LoginReturnType {
    token: String
  }

  """
  Register input
  """
  input RegisterInput {
    username: String
    email: String
    password: String
  }

  """
  Queries
  """
  type Query {
    book(_id: ID!): Book
    books: [Book]
    booksByUserId(_id: ID!): [Book]
    users: [User]
    user(_id: ID!): User
    loginUser(loginInput: LoginInput): LoginReturnType
  }

  """
  Mutations
  """
  type Mutation {
    registerUser(registerInput: RegisterInput): User
    logoutUser: Boolean
    createBook(bookInput: BookInput): Book
    deleteBook(_id: ID!): Book
    updateBook(_id: ID!, bookInput: BookInput): Book
  }
`;

export default typeDefs;
