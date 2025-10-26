import express from "express";
import {translateText,translateBatch } from "../controller/translationController.js";

const router = express.Router();

// GET translations for a language
// POST /api/translate
router.post("/translate", translateText);
router.post("/translate/batch", translateBatch);

export default router;
