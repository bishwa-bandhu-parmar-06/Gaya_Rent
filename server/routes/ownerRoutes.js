// server/routes/ownerRoutes.js
import express from "express";
import {
  getDashboardStats,
  getOwnerProfile,
  updateOwnerProfile,
  getMyProperties,
  addProperty,
  editProperty,
  deleteProperty,
  togglePropertyAvailability,
} from "../controllers/ownerController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
// Ensure you have an inline requireOwner or import requireRole
import { upload } from "../config/cloudinary.js"; // Import the Cloudinary config
// Add this line below your other property POST/PUT routes
import { bulkUploadProperties } from "../controllers/ownerController.js";

const router = express.Router();

// 🛡️ Security: All routes require an 'owner' role
router.use(verifyToken);
const requireOwner = (req, res, next) => {
  if (req.user && req.user.role === "owner") next();
  else res.status(403).json({ message: "Forbidden: Owner access required." });
};
router.use(requireOwner);

// 📊 Dashboard & Profile
router.get("/stats", getDashboardStats);
router.get("/profile", getOwnerProfile);
router.put("/profile", updateOwnerProfile);

// 🏠 Property CRUD
router.get("/properties", getMyProperties);

// We use upload.array('photos', 5) to allow up to 5 images per property
router.post("/properties", upload.array("photos", 5), addProperty);
router.put("/properties/:id", upload.array("photos", 5), editProperty);

router.delete("/properties/:id", deleteProperty);
router.patch("/properties/:id/availability", togglePropertyAvailability);

// Make sure it doesn't use the upload.array middleware, since it's just JSON
router.post("/properties/bulk", bulkUploadProperties);
export default router;
