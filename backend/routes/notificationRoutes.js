import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

import {
  getNotifications,
  markNotificationRead,
} from "../controller/notificationController.js";

const router = express.Router();

router.get(
  "/notifications",
  authMiddleware,
  getNotifications
);

router.put(
  "/notifications/:id",
  authMiddleware,
  markNotificationRead
);

export default router;