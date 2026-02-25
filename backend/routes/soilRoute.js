import express from "express";
import multer from "multer";
import { analyzeSoilImage,parseSoilReportAI } from "../controller/soilreportcontroller.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

// Upload & parse soil report
router.post("/parse", upload.single("file"), parseSoilReportAI);

// Analyze soil image
router.post("/analyze-image", analyzeSoilImage);

export default router;

