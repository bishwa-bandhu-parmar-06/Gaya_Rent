import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import next from "next";
import path from "path";
import { fileURLToPath } from "url";
import db from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";

dotenv.config();

// Fix directory paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if we are in development or production
const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 8000;

const nextApp = next({ dev, dir: path.resolve(__dirname, "../client") });
const handle = nextApp.getRequestHandler();

// Wait for Next.js to get ready, then start Express
nextApp
  .prepare()
  .then(() => {
    const app = express();
    // Configure Helmet to allow Next.js, Google Sign-In, AND Geolocation API
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
              "'self'",
              "'unsafe-inline'",
              "'unsafe-eval'",
              "https://accounts.google.com",
            ],
            scriptSrcElem: [
              "'self'",
              "'unsafe-inline'",
              "https://accounts.google.com",
            ],
            styleSrc: [
              "'self'",
              "'unsafe-inline'",
              "https://accounts.google.com",
              "https://fonts.googleapis.com",
            ],
            imgSrc: ["'self'", "data:", "https:"],

            connectSrc: [
              "'self'",
              "https://accounts.google.com",
              "https://api.bigdatacloud.net",
            ],

            frameSrc: ["'self'", "https://accounts.google.com"],
          },
        },
        crossOriginOpenerPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: false,
      }),
    );
    app.use(cors({ origin: true, credentials: true }));
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ limit: "50mb", extended: true }));

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: "Too many requests, please try again later.",
    });
    // app.use("/api", limiter);

    app.get("/api/status", (req, res) => {
      res.json({ status: "success", message: "Unified Backend is running!" });
    });

    app.use("/api/auth", authRoutes);
    app.use("/api/owner", ownerRoutes);
    app.use("/api/tenant", tenantRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/properties", propertyRoutes);

    app.all(/.*/, (req, res) => {
      return handle(req, res);
    });

    // Start the server
    app.listen(port, "0.0.0.0", () => {
      console.log(`> 🚀 Server running perfectly on port ${port}`);
      console.log(`> 🌍 Environment: ${dev ? "Development" : "Production"}`);
    });
  })
  .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });
