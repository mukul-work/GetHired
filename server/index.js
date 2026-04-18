import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import placementsRouter from "./routes/placements.js";
import blogsRouter from "./routes/blogs.js";
import adminRouter from "./routes/admin.js";
import eventsRouter from "./routes/events.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/placements", placementsRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/events", eventsRouter);

// Health check
app.get("/api/health", (_, res) => {
  const dbState = mongoose.connection.readyState;
  res.json({
    status: "ok",
    db:
      dbState === 1
        ? "connected"
        : dbState === 2
          ? "connecting"
          : "disconnected",
  });
});

// Always start HTTP server first
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to MongoDB (non-blocking — server starts regardless)
mongoose
  .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    console.log(
      "Server running without DB — whitelist your IP in MongoDB Atlas to enable DB features",
    );
  });
