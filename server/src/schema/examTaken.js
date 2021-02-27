import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getExamOfCanidate(examId: ID! ): ExamTaken
    getAllCanidateExam(username: String!): [ExamTaken!]
    getExamResults(examScheduleId: ID!): [ExamTaken]
  }

  extend type Mutation {
    startExam(examDetails: ExamTakenInput!): ExamTakenDetails!
    examEnded(submissionDetails: ExamFinishedInput!): Boolean!
  }

  union ExamTakenDetails = ExamTakenSuccess | Error

  type ExamTakenSuccess {
    type: String
    message: String!
    examId: String!
  }

  input ExamTakenInput {
    examDetails: ExamDetailsInput!
    timeExamStarted: Date!
    canidateDetails: CandidateDetailsInput!
    examStarted: Boolean!
    examFinished: Boolean!
  }

  input ExamFinishedInput {
    examTakenId: ID!
    examFinished: Boolean!
    timeExamEnded: Date
    score: Int
    scripts: [ScriptQuestionInput]
  }

  type ExamTaken {
    id: ID!
    examDetails: ExamDetails!
    timeExamStarted: Date!
    canidateDetails: CandidateDetails!
    examStarted: Boolean!
    examFinished: Boolean!
    timeExamEnded: Date
    score: Int
    scripts: [ScriptQuestion]
  }

  type ScriptQuestion {
    number: Int
    selectedOption: String
    correctOption: String
    explanation: String
    question: String
  }

  input ScriptQuestionInput {
    number: Int
    selectedOption: String
    correctOption: String
    explanation: String
    question: String
  }
  input ExamDetailsInput {
    examinationName: String!
    examinationId: ID!
    numberOfQuestions: Int!
    duration: Int!
  }

  type ExamDetails {
    examinationName: String!
    examinationId: ID!
    numberOfQuestions: String!
    duration: Int!
  }
  type CandidateDetails {
    username: String
    name: String
  }

  input CandidateDetailsInput {
    username: String
    name: String
  }
`;
