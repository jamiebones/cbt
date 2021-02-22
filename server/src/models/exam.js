import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ExamSchema = new Schema({
  examName: String,
});
ExamSchema.index({ examName: 1 });
export default mongoose.model("exam", ExamSchema);
