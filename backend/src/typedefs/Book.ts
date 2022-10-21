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
    author: String
    title: String
    description: String
    genre: EGenreType
    offset: Int,
    limit: Int,
    sort: ESortType
}

input BookCreateInput {
    author: String
    title: String
    description: String
    genre: EGenreType
}

type Query {
    book(_id: ID!): Book
    books(bookInput: BookInput): [Book]
    booksByUserId(_id: ID!, limit: Int!, offset: Int!): [Book]
}

type Mutation {
    createBook(bookInput: BookCreateInput): Book
    deleteBook(_id: ID!): Book
    updateBook(_id: ID!, bookInput: BookCreateInput): Book
}

enum EGenreType {
    Fiction
    Nonfiction
    Drama
    Poetry
    Folktale
}


enum ESortType {
    Latest,
    Oldest
}


type Subscription {
    newBookCreated(genre: EGenreType!): Book
}
    `;
