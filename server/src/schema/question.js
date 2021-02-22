import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getAnyQuestion: Question
    getQuestions(number: String): [Question!]
    getAllQuestions(offset: Int, examId: String): QuestionsTotal
    getExamQuestions(
      examId: String!
      cursor: String
      limit: Int
    ): QuestionConnection
  }

  extend type Mutation {
    addImageToQuestion(questionId: ID!, imageUrl: String!): Boolean!
    saveBulkQuestion(input: [QuestionInput]): String! #number here is the total number of questions saved
    editQuestion(input: QuestionInput!, questionId: ID!): Boolean!
    deleteQuestion(questionId: ID!): Boolean!
    submitQuestion(input: QuestionInput!): Boolean!
  }

  type Question {
    id: ID!
    question: String!
    answers: [Answers!]
    questionImageUrl: String
    examinationType: String!
    examId: ID
    explanation: String
    createdAt: Date
  }

  type Answers {
    option: String
    isCorrect: Boolean
    selected: Boolean
  }
  input AnswersInput {
    option: String
    isCorrect: Boolean
    selected: Boolean
  }
  input QuestionInput {
    question: String!
    answers: [AnswersInput!]
    questionImageUrl: String
    examinationType: String!
    examId: String
    explanation: String
  }
  input QuestionInput2 {
    question: String!
    answers: [AnswersInput!]
    questionImageUrl: String
    examinationType: String!
    examId: String
    explanation: String
    id: ID!
  }
  type QuestionConnection {
    edges: [Question!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
    totalCount: String
  }

  type QuestionsTotal {
    questions: [Question!]!
    totalQuestion: String!
  }
`;
