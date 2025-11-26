const express = require("express");
const { DoctorController } = require("../controllers/doctor.controllers");
const { Auth } = require("../middlewares/auth.middlewares");
const { imageUploadMiddleware } = require("../middlewares/imageUpload.middleware");

const router = express.Router();

// GET requests - Public endpoints with comprehensive query support
router.get("/", DoctorController.getAllDoctors);
// Query params: page, limit, search, sort, specialty, mainCategory, cities, status,
// rating, minRating, maxRating, consultationFees, minFees, maxFees, experience,
// isVisitingDoctor, isHospitalDoctor, diseasesTreated, professionalTitle

router.get("/search", DoctorController.searchDoctors); // Advanced search endpoint
// Query params: q (query), filters (JSON string), location, radius

router.get("/active", DoctorController.getActiveDoctors); // Active doctors only
router.get("/inactive", DoctorController.getInactiveDoctors); // Inactive doctors (Admin only)

router.get("/specialties", DoctorController.getSpecialties); // Get all unique specialties
router.get("/categories", DoctorController.getMainCategories); // Get all unique main categories
router.get("/cities", DoctorController.getCities); // Get all practice cities
router.get("/titles", DoctorController.getProfessionalTitles); // Get all professional titles

router.get("/featured", DoctorController.getFeaturedDoctors); // High-rated doctors
router.get("/nearby", DoctorController.getNearbyDoctors); // Location-based search
// Query params: lat, lng, radius (in km)

router.get("/specialty/:specialty", DoctorController.getDoctorsBySpecialty);
router.get("/city/:city", DoctorController.getDoctorsByCity);
router.get("/category/:category", DoctorController.getDoctorsByCategory);

router.get(
  "/stats",
  //[Auth]
  DoctorController.getDoctorStats
); // Admin stats
router.get("/count", DoctorController.getDoctorCount); // Public count

router.get("/:doctorId", DoctorController.getDoctorById); // Doctor details
router.get("/:doctorId/reviews", DoctorController.getDoctorReviews); // Doctor reviews (if implemented)
router.get("/:doctorId/availability", DoctorController.getDoctorAvailability); // Doctor availability

// Doctor media & reviews (commented out until methods are implemented)
// router.post("/:doctorId/image", [Auth], DoctorController.uploadDoctorImage);
// router.put("/:doctorId/availability", [Auth], DoctorController.updateDoctorAvailability);
// router.post("/:doctorId/reviews", DoctorController.addDoctorReview);

// POST requests (Admin only)
router.post(
  "/",
  //[Auth]
  imageUploadMiddleware("profileImage", "doctors"),
  DoctorController.createDoctor
);
router.post(
  "/bulk",
  //[Auth]
  DoctorController.createBulkDoctors
); // Bulk create
router.post(
  "/:doctorId/qualifications",
  //[Auth]
  DoctorController.addQualification
);
router.post(
  "/:doctorId/cities",
  //[Auth]
  DoctorController.addCity
);
router.post(
  "/:doctorId/diseases",
  //[Auth]
  DoctorController.addDisease
);
router.post(
  "/:doctorId/clone",
  //[Auth]
  DoctorController.cloneDoctor
); // Clone doctor profile

// PUT requests (Admin only)
router.put(
  "/:doctorId",
  //[Auth]
  imageUploadMiddleware("profileImage", "doctors"),
  DoctorController.updateDoctor
);
router.put(
  "/:doctorId/status",
  //[Auth]
  DoctorController.updateDoctorStatus
);
router.put(
  "/:doctorId/rating",
  //[Auth]
  DoctorController.updateDoctorRating
);
router.put(
  "/:doctorId/fees",
  //[Auth]
  DoctorController.updateConsultationFees
);
router.put(
  "/bulk/status",
  //[Auth]
  DoctorController.bulkUpdateStatus
); // Bulk status update

// PATCH requests (Admin only)
router.patch(
  "/:doctorId/qualifications/:qualificationId",
  //[Auth]
  DoctorController.updateQualification
);

// DELETE requests (Admin only)
router.delete(
  "/:doctorId",
  //[Auth]
  DoctorController.deleteDoctor
);
router.delete(
  "/bulk",
  //[Auth]
  DoctorController.bulkDeleteDoctors
); // Bulk delete
router.delete(
  "/:doctorId/qualifications/:qualificationId",
  //[Auth]
  DoctorController.removeQualification
);
router.delete(
  "/:doctorId/cities",
  //[Auth]
  DoctorController.removeCity
);
router.delete(
  "/:doctorId/diseases",
  //[Auth]
  DoctorController.removeDisease
);

module.exports.DoctorRouter = router;
