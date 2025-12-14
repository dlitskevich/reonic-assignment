import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Query {
    hello: String
    users: [User!]!
    user(id: Int!): User
  }

  type Mutation {
    createUser(email: String!, name: String): User!
    updateUser(id: Int!, email: String, name: String): User!
    deleteUser(id: Int!): Boolean!
  }

  type User {
    id: Int!
    email: String!
    name: String
  }
`;
