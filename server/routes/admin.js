import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.js";
import {
  login,
  uploadPlacements,
  deletePlacement,
} from "../controllers/adminController.js";

const router  = express.Router();
const upload  = multer({ storage: multer.memoryStorage() });

router.post("/login",              login);
router.post("/upload", protect, upload.single("file"), uploadPlacements);
router.delete("/placements/:id",   protect, deletePlacement);

export default router;