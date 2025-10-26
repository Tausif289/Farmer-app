// routes/cropRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import { analyzeCropHealth } from "../controller/crophealthcontroller.js";

const router = express.Router();
// POST /api/crop/health
router.post("/health",analyzeCropHealth);

export default router;

