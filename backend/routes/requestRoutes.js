import express from "express";

import { sendJoinRequest, getProjectRequests,getReceivedRequests, acceptJoinRequest, rejectJoinRequest } from "../controller/requestController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/send",authMiddleware,sendJoinRequest);

router.get("/project/:projectId",authMiddleware,getProjectRequests);

router.get("/requests",authMiddleware,getReceivedRequests);

router.put("/accept/:id",authMiddleware,acceptJoinRequest);

router.put("/reject/:id",authMiddleware,rejectJoinRequest);

export default router;