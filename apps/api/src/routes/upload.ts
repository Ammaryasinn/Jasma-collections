// apps/api/src/routes/upload.ts
// Cloudinary upload endpoint using Multer

import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { Role } from "@prisma/client";
import { sendSuccess, sendError } from "../utils/response";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

export const uploadRouter = Router();

uploadRouter.post(
  "/",
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.MANAGER),
  upload.single("image"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return sendError(res, "No file uploaded", 400);
      }

      // Convert buffer to base64 for Cloudinary
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "jasma",
        resource_type: "image",
      });

      return sendSuccess(res, { url: result.secure_url }, 201);
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return sendError(res, "Failed to upload image", 500);
    }
  }
);
