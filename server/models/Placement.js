import mongoose from "mongoose";

const placementSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    branch: {
      type: String,
      required: true,
      enum: ["CSE", "IT", "ECE", "ME", "CE", "EEE"],
    },
    company: { type: String, required: true },
    role: { type: String, required: true },
    package: { type: Number, required: true }, // in LPA
    year: { type: Number, required: true },
    type: {
      type: String,
      enum: ["On-Campus", "Off-Campus", "Internship"],
      default: "On-Campus",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Placement", placementSchema);
