import express from "express";
import multer from "multer";
import jwt from "jsonwebtoken";
import csvParser from "csv-parser";
import { Readable } from "stream";
import XLSX from "xlsx";
import Placement from "../models/Placement.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

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

// POST /api/admin/upload — upload CSV or Excel file with placements
router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const ext = req.file.originalname.split(".").pop().toLowerCase();
    let records = [];

    if (ext === "csv") {
      await new Promise((resolve, reject) => {
        const stream = Readable.from(req.file.buffer.toString());
        stream
          .pipe(csvParser())
          .on("data", (row) => {
            records.push({
              studentName: row.studentName || row.name || "",
              branch: row.branch || "",
              company: row.company || "",
              role: row.role || "",
              package: parseFloat(row.package || row.pkg || 0),
              year: parseInt(row.year || new Date().getFullYear()),
              type: row.type || "On-Campus",
            });
          })
          .on("end", resolve)
          .on("error", reject);
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const wb = XLSX.read(req.file.buffer, { type: "buffer" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws);
      records = rows.map((row) => ({
        studentName: row.studentName || row.name || "",
        branch: row.branch || "",
        company: row.company || "",
        role: row.role || "",
        package: parseFloat(row.package || row.pkg || 0),
        year: parseInt(row.year || new Date().getFullYear()),
        type: row.type || "On-Campus",
      }));
    } else {
      return res
        .status(400)
        .json({ message: "Unsupported file type. Use CSV or XLSX." });
    }

    const validRecords = records.filter(
      (r) => r.studentName && r.branch && r.company && r.package > 0,
    );
    if (!validRecords.length)
      return res
        .status(400)
        .json({ message: "No valid records found in file" });

    await Placement.insertMany(validRecords);
    res.json({
      message: `Successfully inserted ${validRecords.length} records`,
      count: validRecords.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/placements/:id — delete a placement record
router.delete("/placements/:id", protect, async (req, res) => {
  try {
    await Placement.findByIdAndDelete(req.params.id);
    res.json({ message: "Record deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
