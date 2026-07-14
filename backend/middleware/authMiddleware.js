import jwt from "jsonwebtoken";
import User from "../model/User.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: "Access denied."
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id)
      .select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    req.user = user;

    next();

  } catch (error) {
    console.log("Auth Middleware Error:", error);

    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};