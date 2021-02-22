export default {
  Query: {
    getAllExam: async (parent, args, { models }) => {
      const exams = await models.Exam.find({}).sort([["examName", 1]]);
      return exams;
    },
    getExamination: async (parent, args, { models }) => {
      const { examId } = args;
      const oneExam = await models.Exam.findOne({ _id: examId });
      return oneExam;
    },
    dashboardMetrics: async (parent, args, { models }) => {
      //active exams
      //total scripts
      //total questions
      //total users
  
      const [activeExams, totalQuestions, users] = await Promise.all([
        models.ExamSchedule.find({ active: true }).countDocuments(),
        models.Question.countDocuments(),
        models.User.countDocuments(),
      ]);

      let activeExamsObj = {
        type: "active exams",
        value: +activeExams,
      };
      let totalQuestionsObj = {
        type: "total questions",
        value: +totalQuestions,
      };
      let totalUsers = {
        type: "total users",
        value: +users,
      };
      let resultArray = [activeExamsObj, totalQuestionsObj, totalUsers];
      return resultArray;
    },
  },
  Mutation: {
    createExam: async (parent, { examName }, { models }) => {
      const newExam = new models.Exam({
        examName,
      });
      try {
        await newExam.save();
        return newExam;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    deleteExam: async (parent, { examId }, { models }) => {
      try {
        await models.Exam.findOneAndDelete(examId);
        return true;
      } catch (error) {
        return false;
      }
    },
    editExam: async (parent, { examName, examId }, { models }) => {
      try {
        const update = { examName };
        await models.Exam.updateOne({ _id: examId }, update);
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
