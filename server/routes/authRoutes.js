import express from "express";
import {
  registerTenant,
  registerOwner,
  registerAdmin,
  login,
  loginAdmin,
  googleLogin,
  forgotPassword,
  resetPassword,
  verifyUser,
} from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
// IMPORT YOUR NEW CLOUDINARY UPLOADER
import { uploadDocuments } from "../config/cloudinary.js";

const router = express.Router();

// The routes mapped to separate controllers using Cloudinary upload
router.post(
  "/register/tenant",
  uploadDocuments.single("document"),
  registerTenant,
);
router.post(
  "/register/owner",
  uploadDocuments.single("document"),
  registerOwner,
);

// Admin routes (Standard JSON, no file upload)
router.post("/register/admin", registerAdmin);
router.post("/login/admin", loginAdmin);

router.post("/login", login);
router.post("/google", googleLogin);

router.post("/verify-user", verifyUser);
// Unprotected route (Anyone can hit this if they forgot their password)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", verifyToken, resetPassword);

export default router;
