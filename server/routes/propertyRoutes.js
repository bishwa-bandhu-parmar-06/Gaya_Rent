import express from "express";
import {
  getAllProperties,
  getPropertyById,
  getPropertyReviews,
} from "../controllers/propertyController.js";

const router = express.Router();


router.get("/", getAllProperties);

router.get("/:id", getPropertyById);
router.get("/:id/reviews", getPropertyReviews);

export default router;
