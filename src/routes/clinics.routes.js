const express = require("express");
const { ClinicController } = require("../controllers/clinic.controllers");
const { Auth } = require("../middlewares/auth.middlewares");

const router = express.Router();

// GET requests - Public endpoints with comprehensive query support
router.get("/", ClinicController.getAllClinics);
// Query params: page, limit, search, sort, name, type, city, state, pincode, status,
// specialties, facilities, amenities, isEmergencyCenter, is24Hours, hasParking, 
// hasWheelchairAccess, phone, email

router.get("/active", ClinicController.getActiveClinics); // Active clinics only

router.get("/emergency", ClinicController.getEmergencyCenters); // Emergency centers
router.get("/24hours", ClinicController.get24HourClinics); // 24-hour clinics

router.get("/city/:city", ClinicController.getClinicsByCity);
router.get("/type/:type", ClinicController.getClinicsByType);
router.get("/specialty/:specialty", ClinicController.getClinicsBySpecialty);

router.get("/stats", ClinicController.getClinicStats); // Clinic statistics

router.get("/:clinicId", ClinicController.getClinicById); // Clinic details

// Additional clinic endpoints (commented out until methods are implemented)
// router.get("/types", ClinicController.getClinicTypes);
// router.get("/cities", ClinicController.getClinicCities);
// router.get("/search", ClinicController.searchClinics);

// POST requests
router.post("/", [Auth], ClinicController.createClinic); // Admin only
router.post("/:clinicId/specialties", [Auth], ClinicController.addSpecialty); // Admin only
router.post("/:clinicId/facilities", [Auth], ClinicController.addFacility); // Admin only
router.post("/filter/amenities", ClinicController.getClinicsByAmenities); // Public endpoint (POST for array data)

// Clinic media & management (commented out until methods are implemented)
// router.post("/:clinicId/image", [Auth], ClinicController.uploadClinicImage);
// router.get("/:clinicId/doctors", ClinicController.getClinicDoctors);
// router.post("/:clinicId/doctors", [Auth], ClinicController.addDoctorToClinic);
// router.delete("/:clinicId/doctors/:doctorId", [Auth], ClinicController.removeDoctorFromClinic);
// router.get("/:clinicId/working-hours", ClinicController.getWorkingHours);
// router.put("/:clinicId/working-hours", [Auth], ClinicController.updateWorkingHours);
// router.get("/:clinicId/reviews", ClinicController.getClinicReviews);
// router.post("/:clinicId/reviews", ClinicController.addClinicReview);

// PUT requests (Admin only)
router.put("/:clinicId", [Auth], ClinicController.updateClinic);
router.put("/:clinicId/status", [Auth], ClinicController.updateClinicStatus);
router.put("/:clinicId/working-hours", [Auth], ClinicController.updateWorkingHours);

// DELETE requests (Admin only)
router.delete("/:clinicId", [Auth], ClinicController.deleteClinic);
router.delete("/:clinicId/specialties", [Auth], ClinicController.removeSpecialty);
router.delete("/:clinicId/facilities", [Auth], ClinicController.removeFacility);

module.exports.ClinicRouter = router;
