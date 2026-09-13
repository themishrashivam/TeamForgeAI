import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../controller/authController.js";

import express from "express";

import { authMiddleware } from "../middleware/authMiddleware.js";

import { getDashboardData } from "../controller/dashboardController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);


router.post("/forgot-password", forgotPassword);


router.post("/reset-password/:token", resetPassword);

router.get(
  "/dashboard",
  authMiddleware,
  getDashboardData
);

router.get("/profile", authMiddleware);

export default router;