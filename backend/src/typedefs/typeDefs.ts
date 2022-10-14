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
  Login inputs
  """
  input LoginInput {
    email: String
    password: String
  }

  type LoginReturnType {
    token: String
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
    login(loginInput: LoginInput): LoginReturnType
  }

  """
  Mutations
  """
  type Mutation {
    createBook(bookInput: BookInput): Book
    deleteBook(_id: ID!): Boolean
    updateBook(_id: ID!, bookInput: BookInput): Boolean
  }
`;

export default typeDefs;
