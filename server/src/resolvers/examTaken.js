export default {
  Query: {
    getExamOfCanidate: async (parent, {}, {}) => {},
    getAllCanidateExam: async (parent, {}, {}) => {},
    getExamResults: async (parent, {}, {}) => {},
  },
  Mutation: {
    startExam: async (_, { examDetails }, { models }) => {
      //check if the person has an examination running already
      examDetails.timeExamStarted = new Date();
      const findExamRunning = await models.ExamTaken.find({
        "examDetails.examinationId": examDetails.examinationId,
        examFinished: false,
      });
      if (findExamRunning) {
        return {
          message: "You already have an examination running",
          type: "ExaminationRunning",
        };
      }
      const newExam = models.ExamTaken(examDetails);
      const examId = await newExam.save();
      return {
        message: "Exam started",
        type: "ExamStarted",
        examId,
      };
    },
    examEnded: async (_, { examDetails }, { models }) => {
      //check if the person has an examination running already
      const { examTakenId, examFinished, score, scripts } = examDetails;

      await models.ExamTaken.findOneAndUpdate(examTakenId, {
        set: {
          examFinished,
          timeExamEnded: new Date(),
          score,
          scripts,
        },
      });

      return true;
    },
  },
};
