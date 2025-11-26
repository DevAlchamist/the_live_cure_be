require("dotenv").config();
const ImageKit = require("imagekit");

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Upload file to ImageKit
 * @param {Buffer} fileBuffer - File buffer to upload
 * @param {String} folder - Folder path in ImageKit (e.g., "images", "doctors", "clinics")
 * @param {String} fileName - Optional custom file name
 * @returns {Promise<Object>} ImageKit upload result with url, fileId, etc.
 */
const uploadOnImageKit = async (fileBuffer, folder = "uploads", fileName = null) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) {
      resolve(null);
      return;
    }

    // Generate a unique file name if not provided
    const uniqueFileName = fileName || `file_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // Prepend "liv_cure" to the folder path
    const baseFolder = "liv_cure";
    const fullFolderPath = folder ? `${baseFolder}/${folder}` : baseFolder;

    imagekit.upload(
      {
        file: fileBuffer,
        fileName: uniqueFileName,
        folder: fullFolderPath,
        useUniqueFileName: true,
      },
      (error, result) => {
        if (error) {
          console.error("ImageKit upload error:", error);
          reject(error);
        } else {
          resolve({
            url: result.url,
            fileId: result.fileId,
            filePath: result.filePath,
            name: result.name,
            size: result.size,
            fileType: result.fileType,
          });
        }
      }
    );
  });
};

/**
 * Delete file from ImageKit
 * @param {String} fileId - ImageKit file ID
 * @returns {Promise<Object>} Deletion result
 */
const deleteOnImageKit = async (fileId) => {
  return new Promise((resolve, reject) => {
    if (!fileId) {
      resolve(null);
      return;
    }

    imagekit.deleteFile(fileId, (error, result) => {
      if (error) {
        console.error("ImageKit delete error:", error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * Delete file from ImageKit by URL
 * Note: ImageKit requires fileId for deletion. This function attempts to find
 * the file by searching for it using the file path extracted from the URL.
 * For best results, store fileId when uploading and use deleteOnImageKit(fileId) instead.
 * @param {String} fileUrl - ImageKit file URL
 * @returns {Promise<Object>} Deletion result
 */
const deleteOnImageKitByUrl = async (fileUrl) => {
  return new Promise((resolve, reject) => {
    if (!fileUrl) {
      resolve(null);
      return;
    }

    try {
      // Extract file path from URL
      const url = new URL(fileUrl);
      const filePath = url.pathname.substring(1); // Remove leading slash
      
      // Extract file name from path
      const fileName = filePath.split('/').pop();
      
      // Try to find the file by name using listFiles
      imagekit.listFiles({
        searchQuery: `name:"${fileName}"`,
        limit: 100
      }, (listError, listResult) => {
        if (listError) {
          console.error("ImageKit list files error:", listError);
          // If listing fails, we can't delete - resolve with a warning
          resolve({ message: "Could not find file to delete", error: listError.message });
          return;
        }

        // Find the file that matches the path
        const file = listResult?.find(f => f.filePath === filePath || f.url === fileUrl);
        
        if (file && file.fileId) {
          // Found the file, delete using fileId
          imagekit.deleteFile(file.fileId, (deleteError, deleteResult) => {
            if (deleteError) {
              console.error("ImageKit delete error:", deleteError);
              reject(deleteError);
            } else {
              resolve(deleteResult);
            }
          });
        } else {
          // File not found, might already be deleted
          console.warn("File not found in ImageKit:", filePath);
          resolve({ message: "File not found or already deleted" });
        }
      });
    } catch (error) {
      console.error("Error parsing URL:", error);
      reject(error);
    }
  });
};

module.exports = {
  imagekit,
  uploadOnImageKit,
  deleteOnImageKit,
  deleteOnImageKitByUrl,
};

