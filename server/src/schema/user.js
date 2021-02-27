import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    loginUser(username: String!, password: String!): UserDetailsResult
    #users: [User!]
    #user(id: ID!): User
    #activeUsers(active: Boolean!): [ User! ]
  }

  extend type Mutation {
    createUser(
      username: String!
      password: String!
      userType: String
      name: String!
    ): UserDetailsResult!
  }

  union UserDetailsResult = User | Error

  

  type User {
    id: ID!
    username: String!
    password: String!
    userType: String!
    active: Boolean
    name: String
    token: String
  }
`;
