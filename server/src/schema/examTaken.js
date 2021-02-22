import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getExamOfCanidate(username: String!, examName: String!): ExamTaken
    getAllCanidateExam(username: String!): [ExamTaken!]
    getExamResults(examName: String): [ExamTaken]
  }

  extend type Mutation {
    startExam(examDetails: ExamTakenInput!): ExamTakenSuccess!
    examEnded(exam: ExamFinishedInput! ): Boolean!
  }

  union ExamTakenDetails = Error | ExamTakenSuccess

  type ExamTakenSuccess {
    type: String!
    message: String!
    examId: ID!
  }

  input ExamTakenInput {
    examDetails: ExamDetails!
    timeExamStarted: Date!
    candidateDetails: CandidateDetails!
    examStarted: Boolean!
  }

  input ExamFinishedInput {
    examTakenId: ID!
    examFinished: Boolean!
    timeExamEnded: Date
    score: Number
    scripts: [ScriptQuestion]
  }

  type ExamTaken {
    id: ID!
    examDetails: ExamDetails!
    timeExamStarted: Date!
    candidateDetails: CandidateDetails!
    examStarted: Boolean!
    examFinished: Boolean!
    timeExamEnded: Date
    score: Number
    scripts: [ScriptQuestion]
  }

  type ScriptQuestion {
    number: Int
    selectedOption: String
    correctOption: String
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
`;
