import express from "express";
import Blog from "../models/Blog.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET /api/blogs — all blogs with search
router.get("/", async (req, res) => {
  try {
    const { search, tag, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }
    if (tag) filter.tags = tag;
    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Blog.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select("-content"),
      Blog.countDocuments(filter),
    ]);
    const allTags = await Blog.distinct("tags");
    res.json({
      data,
      total,
      allTags,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/blogs/:id — single blog with full content
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/blogs — create blog (admin only)
router.post("/", protect, async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/blogs/:id — update blog (admin only)
router.put("/:id", protect, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/blogs/:id — delete blog (admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
