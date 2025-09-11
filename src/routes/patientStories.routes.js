const express = require("express");
const {
  PatientStoryController,
} = require("../controllers/patientStory.controllers");
const { Auth } = require("../middlewares/auth.middlewares");

const router = express.Router();

// GET requests - Public endpoints
router.get("/", PatientStoryController.getAllPatientStories);
// Query params: page, limit, search, sort, category, condition, featured, verified, minRating, status

router.get("/featured", PatientStoryController.getFeaturedStories);
// Query params: page, limit

router.get("/categories", PatientStoryController.getCategories);

router.get("/conditions", PatientStoryController.getConditions);

router.get("/recent", PatientStoryController.getRecentStories);
// Query params: limit

router.get("/high-rated", PatientStoryController.getStoriesByRating);
// Query params: minRating, page, limit

router.get("/search", PatientStoryController.searchStories);
// Query params: q (query), page, limit

router.get("/category/:category", PatientStoryController.getStoriesByCategory);
// Query params: page, limit

router.get(
  "/condition/:condition",
  PatientStoryController.getStoriesByCondition
);
// Query params: page, limit

router.get("/:id", PatientStoryController.getPatientStoryById);

// POST requests (Admin only)
router.post(
  "/",
  //[Auth]
  PatientStoryController.createPatientStory
);

// PUT requests (Admin only)
router.put(
  "/:id",
  //[Auth]
  PatientStoryController.updatePatientStory
);

// PATCH requests (Admin only)
router.patch(
  "/:id/verify",
  //[Auth]
  PatientStoryController.verifyStory
);

// DELETE requests (Admin only)
router.delete(
  "/:id",
  //[Auth]
  PatientStoryController.deletePatientStory
);

module.exports = { PatientStoryRouter: router };
