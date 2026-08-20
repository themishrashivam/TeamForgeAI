import express from "express";

import {
  sendMessage,
  getMessages,
  getConversations,
  markMessageRead,
  getUnreadMessageCount,
  searchMessageMembers,
} from "../controller/messageController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/send",
  authMiddleware,
  sendMessage
);

router.get(
  "/conversations",
  authMiddleware,
  getConversations
);

router.get(
  "/unread-count",
  authMiddleware,
  getUnreadMessageCount
);

router.get(
  "/members/search",
  authMiddleware,
  searchMessageMembers
);

router.get(
  "/:projectId/:userId",
  authMiddleware,
  getMessages
);

router.put(
  "/read/:projectId/:userId",
  authMiddleware,
  markMessageRead
);

export default router;