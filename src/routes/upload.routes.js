const express = require("express");
const multer = require("multer");
const { Auth } = require("../middlewares/auth.middlewares");
const { uploadOnCloudinary } = require("../utils/cloudinary");

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Upload middleware
const uploadImageMiddleware = upload.single("image");
const uploadDocumentMiddleware = upload.single("document");
const uploadAvatarMiddleware = upload.single("avatar");

// File Upload Endpoints
router.post("/image", [Auth], uploadImageMiddleware, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: true,
        message: "No image file uploaded" 
      });
    }

    const result = await uploadOnCloudinary(req.file.buffer, "images");
    
    res.json({
      error: false,
      message: "Image uploaded successfully",
      result: { 
        url: result.url, 
        publicId: result.public_id,
        secureUrl: result.secure_url
      },
    });
  } catch (error) {
    res.status(500).json({ 
      error: true,
      message: "Error uploading image", 
      result: error.message 
    });
  }
});

router.post("/document", [Auth], uploadDocumentMiddleware, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: true,
        message: "No document file uploaded" 
      });
    }

    const result = await uploadOnCloudinary(req.file.buffer, "documents");
    
    res.json({
      error: false,
      message: "Document uploaded successfully",
      result: { 
        url: result.url, 
        publicId: result.public_id,
        secureUrl: result.secure_url,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype
      },
    });
  } catch (error) {
    res.status(500).json({ 
      error: true,
      message: "Error uploading document", 
      result: error.message 
    });
  }
});

router.post("/avatar", [Auth], uploadAvatarMiddleware, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: true,
        message: "No avatar file uploaded" 
      });
    }

    const result = await uploadOnCloudinary(req.file.buffer, "avatars");
    
    res.json({
      error: false,
      message: "Avatar uploaded successfully",
      result: { 
        url: result.url, 
        publicId: result.public_id,
        secureUrl: result.secure_url
      },
    });
  } catch (error) {
    res.status(500).json({ 
      error: true,
      message: "Error uploading avatar", 
      result: error.message 
    });
  }
});

module.exports.UploadRouter = router;
