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
  recommendTeamMembers,
} from "../controller/projectController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

import { getDashboardData } from "../controller/dashboardController.js";

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  getDashboardData
);

router.post(
  "/create",
  authMiddleware,
  createProject
);

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

router.post(
  "/:id/ai-recommendations",
  authMiddleware,
  recommendTeamMembers
);

router.put(
  "/:id",
  authMiddleware,
  updateProject
);

router.delete(
  "/:id",
  authMiddleware,
  deleteProject
);

router.delete(
  "/:projectId/members/:userId",
  authMiddleware,
  removeTeamMember
);

router.delete(
  "/:projectId/leave",
  authMiddleware,
  leaveProject
);

router.get(
  "/:id",
  authMiddleware,
  getSingleProject
);

export default router;