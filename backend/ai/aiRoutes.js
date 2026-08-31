import express from "express";
import { analyzeProject } from "./aiController.js";

const router = express.Router();

router.post("/analyze-project", analyzeProject);

export default router;