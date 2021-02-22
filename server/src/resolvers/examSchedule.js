export default {
  Query: {
    getexamSchedule: async (_, { examScheduleId }, { models }) => {
      const examSchedule = await models.ExamSchedule.findOne({
        _id: examScheduleId,
      });
      return examSchedule;
    },
    activeExamination: async (_, {}, { models }) => {
      const activeSchedule = await models.ExamSchedule.find({
        active: true,
      });
      return activeSchedule;
    },
    getExamScheduleByType: async (_, { examTypeId }, { models }) => {
      const examSchedules = await models.ExamSchedule.find({
        examTypeID: examTypeId,
      });
      return examSchedules;
    },
    getActiveExamSchedule: async (_, {}, { models }) => {
      const examSchedules = await models.ExamSchedule.find({ active: true });
      return examSchedules;
    },
    getAllExamSchedule: async (_, {}, { models }) => {
      const allExamSchedules = await models.ExamSchedule.find({});
      return allExamSchedules;
    },
    examScheduleDetails: async (_, { scheduleId }, { models }) => {
      const schedule = await models.ExamSchedule.findOne({ _id: scheduleId });
      return schedule;
    },
  },
  Mutation: {
    createExamSchedule: async (_, { input }, { models }) => {
      try {
        const newSchedule = models.ExamSchedule(input);
        await newSchedule.save();
        return true;
      } catch (error) {
        console.log("the errorfrom the console is:", error);
        throw new Error(error.message);
      }
    },
    makeExamActive: async (_, { examId }, { models }) => {
      try {
        const findSchedule = await models.ExamSchedule.findById(examId);
        if (!findSchedule) {
          return {
            message: "could not find the the examination",
            type: "CouldNotFindExamination",
          };
        }
        //check if the questions is complete
        const questionsNumber = findSchedule && findSchedule.questions.length;
        const totalQuestion = findSchedule && findSchedule.numberofQuestions;
        if (+questionsNumber != +totalQuestion) {
          return {
            message: `Please complete the question in the examination. Total questions in exam: ${totalQuestion}. Entered questions: ${questionsNumber}`,
            type: "CouldNotFindExamination",
          };
        }
        await models.ExamSchedule.updateOne(
          { _id, examId },
          {
            set: {
              active: true,
            },
          }
        );
        return {
          message: "Examination was made active."
        };
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
    editExamSchedule: async (
      _,
      { examScheduleId, examSchedule },
      { models }
    ) => {
      try {
        const {
          numberOfQuestion,
          examName,
          active,
          examDuration,
          questions,
          examTypeId,
          examTypeName,
        } = examSchedule;
        await models.ExamSchedule.updateOne(
          { _id: examScheduleId },
          {
            numberofQuestions: numberOfQuestion,
            examinationName: examName,
            active,
            examinationDuration: examDuration,
            questions,
            examTypeID: examTypeId,
            examTypeName,
          }
        );
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    deleteExamSchedule: async (_, { examScheduleId }, { models }) => {
      try {
        await models.ExamSchedule.findByIdAndRemove(examScheduleId);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    addQuestionsToExam: async (
      _,
      { questionsArray, scheduleId },
      { models }
    ) => {
      try {
        console.log(questionsArray);
        await models.ExamSchedule.updateOne(
          { _id: scheduleId },
          {
            $addToSet: {
              questions: questionsArray,
            },
          }
        );

        return true;
      } catch (error) {
        console.log(error);
        throw new Error("Database Error");
      }
    },
  },
};
