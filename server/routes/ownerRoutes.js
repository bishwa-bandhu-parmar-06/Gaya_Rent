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
  bulkUploadProperties, // Combined the import here for cleaner code
} from "../controllers/ownerController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

// IMPORT THE NEW SPECIFIC CLOUDINARY UPLOADER
import { uploadPropertyPhotos } from "../config/cloudinary.js";

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

// Use uploadPropertyPhotos instead of upload
router.post(
  "/properties",
  uploadPropertyPhotos.array("photos", 5),
  addProperty,
);
router.put(
  "/properties/:id",
  uploadPropertyPhotos.array("photos", 5),
  editProperty,
);

router.delete("/properties/:id", deleteProperty);
router.patch("/properties/:id/availability", togglePropertyAvailability);

// Bulk upload uses raw JSON, no file upload middleware needed here
router.post("/properties/bulk", bulkUploadProperties);

export default router;
