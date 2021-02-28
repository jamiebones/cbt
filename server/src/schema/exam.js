import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getAllExam: [Exam!]
    getExamination(examId: ID!): Exam!
    dashboardMetrics: [DashBoardMetrics!]!
  }

  extend type Mutation {
    createExam(examName: String!): Boolean!
    editExam(examName: String!, examId: ID!): Boolean!
    deleteExam(examId: ID!): Boolean!
  }

  type Exam {
    id: ID!
    examName: String!
  }

  type DashBoardMetrics {
    type: String!
    value: Int!
  }
`;
