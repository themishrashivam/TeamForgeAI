import express from "express";

import {
  createProject,
  getAllProjects,
  getMyProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  removeTeamMember,
  leaveProject,
} from "../controller/projectController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

import { getDashboardData } from "../controller/dashboardController.js";

const router = express.Router();

// Dashboard
router.get(
  "/dashboard",
  authMiddleware,
  getDashboardData
);

// Create
router.post(
  "/create",
  authMiddleware,
  createProject
);

// Get projects
router.get(
  "/all",
  authMiddleware,
  getAllProjects
);

router.get(
  "/my",
  authMiddleware,
  getMyProjects
);

// Edit project
router.put(
  "/:id",
  authMiddleware,
  updateProject
);

// Delete project
router.delete(
  "/:id",
  authMiddleware,
  deleteProject
);

// Remove team member
router.delete(
  "/:projectId/members/:userId",
  authMiddleware,
  removeTeamMember
);

// Leave project
router.delete(
  "/:projectId/leave",
  authMiddleware,
  leaveProject
);

// IMPORTANT: Keep this LAST
router.get(
  "/:id",
  authMiddleware,
  getSingleProject
);

export default router;