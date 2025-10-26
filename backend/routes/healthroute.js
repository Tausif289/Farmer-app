import express from "express";
import { analyzeCropHealth } from "../controller/healthcontroller.js";

const router = express.Router();
router.post('/health',analyzeCropHealth);
export default router;