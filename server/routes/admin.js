import express from "express";
import multer from "multer";
import jwt from "jsonwebtoken";
import XLSX from "xlsx";
import Placement from "../models/Placement.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Normalise row keys to lowercase, no spaces
function normRow(row) {
  const r = {};
  Object.keys(row).forEach((k) => {
    r[k.trim().toLowerCase().replace(/\s+/g, "")] = String(row[k] ?? "").trim();
  });
  return r;
}

// Map normalised row → Placement fields
function mapToPlacement(r) {
  return {
    studentName: r.studentname || r.student_name || r.name || r.student || "",
    branch: r.branch || r.dept || r.department || "",
    company: r.company || r.organisation || r.organization || "",
    role: r.role || r.designation || r.position || r.jobrole || r.job_role || r.jobtitle || "",
    package: parseFloat(r.package || r.pkg || r.ctc || r.salary || 0) || 0,
    year: parseInt(r.year || r.batch || r.passingyear || r.graduationyear || new Date().getFullYear(), 10),
    type: r.type || r.placementtype || r.placement_type || "On-Campus",
  };
}

// POST /api/admin/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
  const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// POST /api/admin/upload — Excel only; OVERWRITES all placements
router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const ext = req.file.originalname.split(".").pop().toLowerCase();
    if (ext !== "xlsx" && ext !== "xls") {
      return res.status(400).json({ message: "Only Excel files (.xlsx or .xls) are allowed." });
    }

    const wb = XLSX.read(req.file.buffer, { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });
    const records = rows.map((row) => mapToPlacement(normRow(row)));

    const validRecords = records.filter(
      (r) => r.studentName && r.branch && r.company && r.package > 0,
    );

    if (!validRecords.length) {
      return res.status(400).json({
        message: "No valid records found. Ensure columns: studentName, branch, company, role, package, year, type",
      });
    }

    await Placement.deleteMany({});
    await Placement.insertMany(validRecords);

    res.json({
      message: `Database refreshed with ${validRecords.length} records (previous data cleared)`,
      count: validRecords.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/placements/:id
router.delete("/placements/:id", protect, async (req, res) => {
  try {
    await Placement.findByIdAndDelete(req.params.id);
    res.json({ message: "Record deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
