import express from "express";

import {createProject,getAllProjects,getMyProjects,getSingleProject} from "../controller/projectController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

import { getDashboardData } from "../controller/dashboardController.js";

const router = express.Router();

router.get("/dashboard",authMiddleware,getDashboardData);

router.post("/create",authMiddleware,createProject);

router.get("/all",authMiddleware,getAllProjects);

router.get("/my",authMiddleware,getMyProjects);

router.get("/:id",authMiddleware,getSingleProject);

export default router;