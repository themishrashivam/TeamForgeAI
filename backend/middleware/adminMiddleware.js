export const adminMiddleware = (req, res, next) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required"
      });
    }

    next();

  } catch (error) {
    console.log("Admin Middleware Error:", error);

    return res.status(500).json({
      message: "Server Error"
    });
  }
};