import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getexamSchedule(examScheduleId: ID!): ExamSchedule
    getExamScheduleByType(examTypeId: ID!): [ExamSchedule]
    examScheduleDetails(scheduleId: ID!): ExamSchedule
    getAllExamSchedule: [ExamSchedule!]
    getActiveExamSchedule: [ExamSchedule]
    activeExamination: [ExamSchedule!]!
  }

  extend type Mutation {
    createExamSchedule(input: ExamScheduleInput!): Boolean
    addQuestionsToExam(
      questionsArray: [QuestionInput2!]
      scheduleId: ID!
    ): Boolean
    editExamSchedule(
      examScheduleId: ID!
      examSchedule: ExamScheduleInput!
    ): ExamSchedule
    deleteExamSchedule(examScheduleId: ID!): Boolean
    changeExamStatus(examId: ID!, status: Boolean!): ActiveExamDetails!
  }

  union ActiveExamDetails = ActiveExamSuccessful | Error

  input ExamScheduleInput {
    numberofQuestions: Int!
    examinationName: String!
    active: Boolean
    examinationDuration: Int!
    questions: [QuestionInput]
    examTypeID: ID!
    examTypeName: String!
  }

  type Error {
    message: String!
    type: String!
  }

  type ExamSchedule {
    id: ID!
    numberofQuestions: Int!
    examinationName: String!
    active: Boolean
    examinationDuration: Int!
    questions: [Question]
    examTypeID: ID!
    examTypeName: String!
  }

  type ActiveExamSuccessful {
    message: String!
  }
`;
