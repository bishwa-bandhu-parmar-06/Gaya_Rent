import express from "express";
import {
  getDashboardStats,
  getAdminProfile,
  updateAdminProfile,
  getPartners,
  updatePartnerStatus,
  getProperties,
  updatePropertyStatus,
  bulkUpdatePropertyStatus,
} from "../controllers/adminController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ==========================================
// 🛡️ SECURITY MIDDLEWARE
// ==========================================
// 1. Verify the JWT Token
router.use(verifyToken);

// 2. Inline Role Middleware (Ensures ONLY admins can access these routes)
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Forbidden: Administrator access required." });
  }
};
router.use(requireAdmin);

// ==========================================
// 📍 ADMIN ROUTES
// ==========================================

// Dashboard Analytics
router.get("/stats", getDashboardStats);

// Admin Profile Management
router.get("/profile", getAdminProfile);
router.put("/profile", updateAdminProfile);

// Partner (Owner) Management
router.get("/partners", getPartners); // supports ?status=pending
router.put("/partners/:id/status", updatePartnerStatus);

// Add this line BEFORE the single /:id route so Express doesn't confuse "bulk" for an ID
router.put("/properties/bulk-status", bulkUpdatePropertyStatus);

// Property Management
router.get("/properties", getProperties); // supports ?status=pending
router.put("/properties/:id/status", updatePropertyStatus);

export default router;
