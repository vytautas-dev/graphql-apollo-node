export const typeUser = `#graphql
type User {
    _id: ID
    username: String
    email: String
    googleId: String
}


type Query {
    users: [User]
    user(_id: ID!): User
}

type Subscription {
    newUserCreated: User
}

   `;
