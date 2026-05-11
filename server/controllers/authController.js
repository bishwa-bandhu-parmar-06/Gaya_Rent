import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerTenant = async (req, res) => {
  const { name, email, mobile, password, docType, docId } = req.body;
  const file = req.file;

  if (!file) {
    return res
      .status(400)
      .json({ message: "Government document PDF is required." });
  }

  try {
    const existingUser = await User.findByEmailOrMobile(email, mobile);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or Mobile already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const documentUrl = file.path;

    const userId = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "tenant",
      docType,
      docId,
      documentUrl,
      is_approved: true, // Postgres boolean TRUE
    });

    res
      .status(201)
      .json({ message: "Seeker account created successfully", userId });
  } catch (error) {
    console.error("Tenant Registration Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- OWNER REGISTRATION ---
export const registerOwner = async (req, res) => {
  const { name, email, mobile, password, docType, docId } = req.body;
  const file = req.file;

  if (!file) {
    return res
      .status(400)
      .json({ message: "Government document PDF is required." });
  }

  try {
    const existingUser = await User.findByEmailOrMobile(email, mobile);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or Mobile already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const documentUrl = file.path;

    const userId = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "owner",
      docType,
      docId,
      documentUrl,
      is_approved: false, // Postgres boolean FALSE
    });

    res.status(201).json({
      message: "Partner account created successfully. Pending approval.",
      userId,
    });
  } catch (error) {
    console.error("Owner Registration Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- ADMIN REGISTRATION ---
export const registerAdmin = async (req, res) => {
  const { name, email, mobile, password, adminSecret } = req.body;

  // Security Check: Verify the secret key matches your server's .env file
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res
      .status(403)
      .json({ message: "Forbidden: Invalid System Master Key." });
  }

  try {
    const existingUser = await User.findByEmailOrMobile(email, mobile);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or Mobile already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "admin",
      is_approved: true, // Postgres boolean TRUE
      docType: null,
      docId: null,
      documentUrl: null,
    });

    res
      .status(201)
      .json({ message: "System Admin initialized successfully.", userId });
  } catch (error) {
    console.error("Admin Registration Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- ADMIN LOGIN ---
export const loginAdmin = async (req, res) => {
  const { loginId, password } = req.body;

  try {
    const user = await User.findByEmailOrMobile(loginId);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access Denied: Administrator privileges required." });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      token,
      role: user.role,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- LOGIN (SHARED) ---
export const login = async (req, res) => {
  const { loginId, password } = req.body;
  try {
    const user = await User.findByEmailOrMobile(loginId);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // The Pending Approval Check for Owners (Changed to Postgres boolean check)
    if (user.role === "owner" && user.is_approved === false) {
      return res.status(403).json({
        message: "Your account is pending. Please wait for admin approval.",
      });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res
      .status(200)
      .json({ token, role: user.role, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, sub: googleId } = ticket.getPayload();

    let user = await User.findByEmail(email);

    if (!user) {
      const userId = await User.create({
        name,
        email,
        password: null,
        role: "tenant",
        googleId,
        is_approved: true, // Google auth gets auto-approved
      });
      user = { id: userId, role: "tenant", name };
    } else if (user.role !== "tenant") {
      return res
        .status(403)
        .json({ message: "Google login is restricted to tenants." });
    }

    const jwtToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.status(200).json({ token: jwtToken, role: user.role, name: user.name });
  } catch (error) {
    res.status(401).json({ error: "Invalid Google Token" });
  }
};

// --- VERIFY USER EXISTS ---
export const verifyUser = async (req, res) => {
  const { loginId } = req.body;

  if (!loginId) {
    return res.status(400).json({ message: "Login ID is required." });
  }

  try {
    const user = await User.findByEmailOrMobile(loginId);

    if (!user) {
      return res.status(404).json({ message: "Account does not exist." });
    }

    res.status(200).json({ message: "Account verified." });
  } catch (error) {
    console.error("Verify User Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- FORGOT PASSWORD (UNPROTECTED) ---
export const forgotPassword = async (req, res) => {
  const { loginId, newPassword } = req.body;

  if (!loginId || !newPassword) {
    return res
      .status(400)
      .json({ message: "Login ID and new password are required." });
  }

  try {
    const user = await User.findByEmailOrMobile(loginId);
    if (!user) {
      return res
        .status(404)
        .json({
          message: "No account found with that email or mobile number.",
        });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(user.id, hashedPassword);

    res
      .status(200)
      .json({ message: "Password updated successfully. You can now log in." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- RESET PASSWORD (PROTECTED) ---
export const resetPassword = async (req, res) => {
  const userId = req.user?.id;
  const { newPassword } = req.body;

  if (!userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Please log in first." });
  }

  if (!newPassword) {
    return res.status(400).json({ message: "New password is required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(userId, hashedPassword);

    res
      .status(200)
      .json({ message: "Your password has been reset successfully." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
