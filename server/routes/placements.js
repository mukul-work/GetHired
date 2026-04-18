import express from "express";
import {
  getPlacements,
  getStats,
  getYearlyChart,
  getBranchChart,
  getCompaniesChart,
  getPackageDist,
  getTopPerformers,
  getFilters,
} from "../controllers/placementController.js";

const router = express.Router();

router.get("/",                  getPlacements);
router.get("/stats",             getStats);
router.get("/chart/yearly",      getYearlyChart);
router.get("/chart/branch",      getBranchChart);
router.get("/chart/companies",   getCompaniesChart);
router.get("/chart/package-dist",getPackageDist);
router.get("/top-performers",    getTopPerformers);
router.get("/filters",           getFilters);

export default router;
