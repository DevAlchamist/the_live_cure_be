const express = require("express");
const { ClinicController } = require("../controllers/clinic.controllers");
const { Auth } = require("../middlewares/auth.middlewares");

const router = express.Router();

// GET requests - Public endpoints with comprehensive query support
router.get("/", ClinicController.getAllClinics);
// Query params: page, limit, search, sort, name, type, city, state, pincode, status,
// specialties, facilities, amenities, isEmergencyCenter, is24Hours, hasParking, 
// hasWheelchairAccess, phone, email

router.get("/search", ClinicController.searchClinics); // Advanced search endpoint
// Query params: q (query), filters (JSON string), location, radius

router.get("/active", ClinicController.getActiveClinics); // Active clinics only
router.get("/inactive", [Auth], ClinicController.getInactiveClinics); // Inactive clinics (Admin only)

router.get("/types", ClinicController.getClinicTypes); // Get all unique clinic types
router.get("/specialties", ClinicController.getSpecialties); // Get all unique specialties
router.get("/facilities", ClinicController.getFacilities); // Get all unique facilities
router.get("/amenities", ClinicController.getAmenities); // Get all unique amenities
router.get("/cities", ClinicController.getCities); // Get all cities
router.get("/states", ClinicController.getStates); // Get all states

router.get("/emergency", ClinicController.getEmergencyCenters); // Emergency centers
router.get("/24hours", ClinicController.get24HourClinics); // 24-hour clinics
router.get("/accessible", ClinicController.getAccessibleClinics); // Wheelchair accessible
router.get("/parking", ClinicController.getClinicsWithParking); // With parking

router.get("/nearby", ClinicController.getNearbyClinics); // Location-based search
// Query params: lat, lng, radius (in km)

router.get("/open-now", ClinicController.getOpenClinics); // Currently open clinics
router.get("/open-on/:day", ClinicController.getClinicsOpenOnDay); // Open on specific day

router.get("/city/:city", ClinicController.getClinicsByCity);
router.get("/state/:state", ClinicController.getClinicsByState);
router.get("/type/:type", ClinicController.getClinicsByType);
router.get("/specialty/:specialty", ClinicController.getClinicsBySpecialty);

router.get("/stats", [Auth], ClinicController.getClinicStats); // Admin stats
router.get("/count", ClinicController.getClinicCount); // Public count

router.get("/:clinicId", ClinicController.getClinicById); // Clinic details
router.get("/:clinicId/doctors", ClinicController.getClinicDoctors); // Doctors at clinic
router.get("/:clinicId/appointments", [Auth], ClinicController.getClinicAppointments); // Clinic appointments
router.get("/:clinicId/reviews", ClinicController.getClinicReviews); // Clinic reviews (if implemented)

// POST requests
router.post("/", [Auth], ClinicController.createClinic); // Admin only
router.post("/bulk", [Auth], ClinicController.createBulkClinics); // Bulk create (Admin only)
router.post("/:clinicId/specialties", [Auth], ClinicController.addSpecialty); // Admin only
router.post("/:clinicId/facilities", [Auth], ClinicController.addFacility); // Admin only
router.post("/:clinicId/amenities", [Auth], ClinicController.addAmenity); // Admin only
router.post("/:clinicId/clone", [Auth], ClinicController.cloneClinic); // Clone clinic (Admin only)
router.post("/filter/amenities", ClinicController.getClinicsByAmenities); // Public endpoint (POST for array data)

// PUT requests (Admin only)
router.put("/:clinicId", [Auth], ClinicController.updateClinic);
router.put("/:clinicId/status", [Auth], ClinicController.updateClinicStatus);
router.put("/:clinicId/working-hours", [Auth], ClinicController.updateWorkingHours);
router.put("/:clinicId/contact", [Auth], ClinicController.updateClinicContact);
router.put("/bulk/status", [Auth], ClinicController.bulkUpdateStatus); // Bulk status update

// PATCH requests (Admin only)
router.patch("/:clinicId/working-hours/:day", [Auth], ClinicController.updateDayWorkingHours);

// DELETE requests (Admin only)
router.delete("/:clinicId", [Auth], ClinicController.deleteClinic);
router.delete("/bulk", [Auth], ClinicController.bulkDeleteClinics); // Bulk delete
router.delete("/:clinicId/specialties", [Auth], ClinicController.removeSpecialty);
router.delete("/:clinicId/facilities", [Auth], ClinicController.removeFacility);
router.delete("/:clinicId/amenities", [Auth], ClinicController.removeAmenity);

module.exports.ClinicRouter = router;
