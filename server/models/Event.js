import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["hackathon", "workshop", "placement", "speaker", "guest_lecture", "competition", "coding_contest"],
      required: true,
    },
    title:            { type: String, required: true, trim: true },
    organizer:        { type: String, required: true, trim: true },
    date:             { type: String, required: true },
    time:             { type: String, default: "" },
    duration:         { type: String, default: "" },
    mode:             { type: String, enum: ["Online", "Offline", "Hybrid"], default: "Offline" },
    venue:            { type: String, default: "" },
    prize:            { type: String, default: "" },
    tags:             { type: [String], default: [] },
    description:      { type: String, default: "" },
    registrationLink: { type: String, default: "#" },
    deadline:         { type: String, default: "" },
    image:            { type: String, default: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400" },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
