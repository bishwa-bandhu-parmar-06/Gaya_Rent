import express from "express";
import apicache from "apicache";
// 1. Update the import to use the specific property uploader
import { uploadPropertyPhotos } from "../config/cloudinary.js";
import {
  checkSavedStatus,
  getRatedProperties,
  getSavedProperties,
  getTenantProfile,
  rateProperty,
  searchProperties,
  toggleSaveProperty,
  updateTenantProfile,
} from "../controllers/tenantController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
const cache = apicache.middleware;

router.get(
  "/properties/search",
  cache("5 minutes", (req, res) => res.statusCode === 200),
  searchProperties,
);
router.use(verifyToken);

router.post("/saved", toggleSaveProperty);
router.get("/saved", getSavedProperties);
router.get("/saved/:id/check", checkSavedStatus);

const requireTenant = (req, res, next) => {
  if (req.user && req.user.role === "tenant") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Tenant access required." });
  }
};
router.use(requireTenant);

router.get("/profile", getTenantProfile);
router.put("/profile", updateTenantProfile);

// 2. Change 'upload' to 'uploadPropertyPhotos' here
router.post(
  "/properties/:id/rate",
  uploadPropertyPhotos.array("photos", 5),
  rateProperty,
);

router.get("/rated", getRatedProperties);
export default router;
