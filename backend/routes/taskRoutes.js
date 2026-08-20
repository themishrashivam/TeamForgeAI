import express from "express";
import {
  createTask,
  getProjectTasks,
  getSingleTask,
  updateTask,
  updateTaskStatus,
  assignTask,
  addComment,
  deleteComment,
  deleteTask,
  getMyTasks,
  getTaskStats,
} from "../controller/taskController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===========================
   Task Routes
=========================== */

// Create Task
router.post("/create", authMiddleware, createTask);

// Get My Tasks
router.get("/my", authMiddleware, getMyTasks);

// Task Statistics
router.get("/stats", authMiddleware, getTaskStats);

// Get All Tasks of a Project
router.get("/project/:projectId", authMiddleware, getProjectTasks);

// Get Single Task
router.get("/:id", authMiddleware, getSingleTask);

// Update Complete Task
router.put("/:id", authMiddleware, updateTask);

// Update Task Status
router.patch("/status/:id", authMiddleware, updateTaskStatus);

// Assign Task
router.patch("/assign/:id", authMiddleware, assignTask);

// Add Comment
router.post("/:id/comment", authMiddleware, addComment);

// Delete Comment
router.delete(
  "/:taskId/comment/:commentId",
  authMiddleware,
  deleteComment
);

// Delete Task
router.delete("/:id", authMiddleware, deleteTask);

export default router;