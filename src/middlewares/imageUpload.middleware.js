const multer = require("multer");
const { uploadOnImageKit } = require("../utils/imagekit");

// Configure multer for memory storage
const storage = multer.memoryStorage();

// Multer instance
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

/**
 * Middleware to handle single image upload and automatically upload to ImageKit
 * @param {String} fieldName - Name of the form field (default: "image")
 * @param {String} folder - Folder path in ImageKit (default: "uploads")
 * @returns {Function} Express middleware
 */
const imageUploadMiddleware = (fieldName = "image", folder = "uploads") => {
  return async (req, res, next) => {
    // First, handle multer upload
    const multerMiddleware = upload.single(fieldName);
    
    multerMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          error: true,
          message: err.message || "File upload error",
        });
      }

      // If file exists, upload to ImageKit
      if (req.file) {
        try {
          const result = await uploadOnImageKit(req.file.buffer, folder);
          
          if (result && result.url) {
            // Attach the ImageKit URL to req.body for easy access in controllers
            req.body[fieldName] = result.url;
            req.imagekitResult = result; // Store full result for reference
          } else {
            return res.status(500).json({
              error: true,
              message: "Failed to upload image to ImageKit",
            });
          }
        } catch (error) {
          console.error("ImageKit upload error:", error);
          return res.status(500).json({
            error: true,
            message: "Error uploading image to ImageKit",
            details: error.message,
          });
        }
      }

      next();
    });
  };
};

/**
 * Middleware for multiple image uploads
 * @param {String} fieldName - Name of the form field (default: "images")
 * @param {Number} maxCount - Maximum number of files (default: 10)
 * @param {String} folder - Folder path in ImageKit (default: "uploads")
 * @returns {Function} Express middleware
 */
const multipleImageUploadMiddleware = (fieldName = "images", maxCount = 10, folder = "uploads") => {
  return async (req, res, next) => {
    const multerMiddleware = upload.array(fieldName, maxCount);
    
    multerMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          error: true,
          message: err.message || "File upload error",
        });
      }

      // If files exist, upload to ImageKit
      if (req.files && req.files.length > 0) {
        try {
          const uploadPromises = req.files.map((file) =>
            uploadOnImageKit(file.buffer, folder)
          );
          
          const results = await Promise.all(uploadPromises);
          const urls = results
            .filter((result) => result && result.url)
            .map((result) => result.url);

          if (urls.length > 0) {
            req.body[fieldName] = urls;
            req.imagekitResults = results;
          } else {
            return res.status(500).json({
              error: true,
              message: "Failed to upload images to ImageKit",
            });
          }
        } catch (error) {
          console.error("ImageKit upload error:", error);
          return res.status(500).json({
            error: true,
            message: "Error uploading images to ImageKit",
            details: error.message,
          });
        }
      }

      next();
    });
  };
};

module.exports = {
  imageUploadMiddleware,
  multipleImageUploadMiddleware,
  upload, // Export multer instance for custom use cases
};


