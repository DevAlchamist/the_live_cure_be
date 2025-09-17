const express = require("express");
const { Auth } = require("../middlewares/auth.middlewares");
const { SearchController } = require("../controllers/search.controllers");

const router = express.Router();

// GET requests - Public endpoints
router.get("/global", SearchController.globalSearch);
// Query params: q (query), type, page, limit

router.get("/doctors", SearchController.searchDoctors);
// Query params: q, specialty, city, rating, fees, page, limit

router.get("/clinics", SearchController.searchClinics);
// Query params: q, type, city, amenities, page, limit

router.get("/blogs", SearchController.searchBlogs);
// Query params: q, category, page, limit

router.get("/treatments", SearchController.searchTreatments);
// Query params: q, disease, page, limit

router.get("/patient-stories", SearchController.searchPatientStories);
// Query params: q, condition, page, limit

// GET requests - Protected endpoints
router.get("/appointments", [Auth], SearchController.searchAppointments);
// Query params: q, status, date, doctor, patient, page, limit

router.get("/suggestions", SearchController.getSearchSuggestions);
// Query params: q, type, limit

module.exports.SearchRouter = router;
