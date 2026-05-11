import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Configure Cloudinary with your credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 1. Storage for Property Images
const propertyStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "gayarent_properties",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

// 2. NEW: Storage for Government Documents (PDFs & Images)
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "gayarent_documents", // Separate folder
    allowed_formats: ["pdf", "jpg", "jpeg", "png"], // Allow PDFs
    // Cloudinary needs this to properly process non-image files like PDF
    resource_type: "raw",
  },
});

// Export both specific multer instances
export const uploadPropertyPhotos = multer({ storage: propertyStorage });
export const uploadDocuments = multer({ storage: documentStorage });

export default cloudinary;
