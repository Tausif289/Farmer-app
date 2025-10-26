import express from "express";
import multer from "multer";
import { parseSoilReport, saveSoilReport } from "../controller/soilreportcontroller.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

// Upload & parse soil report
router.post("/parse", upload.single("file"), parseSoilReport);

// Save soil report
router.post("/save", saveSoilReport);

export default router;

