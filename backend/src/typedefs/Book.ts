export const typeBook = `#graphql
type Book {
    _id: ID
    user: ID
    author: String
    title: String
    description: String
    genre: EGenreType
}

input BookInput {
    author: String!
    title: String!
    description: String!
    genre: EGenreType!
}

type Query {
    book(_id: ID!): Book
    books: [Book]
    someBooks(limit: Int!, offset: Int!): [Book]
    booksByUserId(_id: ID!): [Book]
    someBooksByUserId(_id: ID!, limit: Int!, offset: Int!): [Book]
}

type Mutation {
    createBook(bookInput: BookInput): Book
    deleteBook(_id: ID!): Book
    updateBook(_id: ID!, bookInput: BookInput): Book
}

enum EGenreType {
    Fiction
    Nonfiction
    Drama
    Poetry
    Folktale
}
    `;
