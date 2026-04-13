import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    batch: { type: String, required: true },
    branch: { type: String, required: true },
    company: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    date: { type: Date, default: Date.now },
    readTime: { type: String, default: "5 min" },
    tags: [{ type: String }],
  },
  { timestamps: true },
);

export default mongoose.model("Blog", blogSchema);
