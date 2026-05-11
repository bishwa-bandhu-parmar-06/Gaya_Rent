import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
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
import {verifyToken} from "../middlewares/authMiddleware.js"
const router = express.Router();

// Ensure upload directory exists
const uploadDir = "uploads/documents/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for PDF uploads (5MB max)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Saves file as: timestamp-originalName.pdf
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-"));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit enforced on backend too
});

// The routes mapped to separate controllers
router.post("/register/tenant", upload.single("document"), registerTenant);
router.post("/register/owner", upload.single("document"), registerOwner);

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
