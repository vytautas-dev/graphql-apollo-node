export const typeUser = `#graphql
type User {
    _id: ID
    username: String
    email: String
    password: String
}

input LoginInput {
    email: String
    password: String
}

input RegisterInput {
    username: String
    email: String
    password: String
}

type Query {
    users: [User]
    user(_id: ID!): User
}

type Mutation {
    registerUser(registerInput: RegisterInput): User
    loginUser(loginInput: LoginInput): Boolean
    logoutUser: Boolean
}

type Subscription {
    newUserCreated: User
}

   `;
