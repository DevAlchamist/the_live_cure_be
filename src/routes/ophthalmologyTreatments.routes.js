const express = require("express");
const { OphthalmologyTreatmentController } = require("../controllers/ophthalmologyTreatment.controllers");
const { Auth } = require("../middlewares/auth.middlewares");

const router = express.Router();

// GET requests - Public endpoints
router.get("/", OphthalmologyTreatmentController.getAllTreatments);
// Query params: page, limit, search, sort, status

router.get("/titles", OphthalmologyTreatmentController.getTreatmentTitles);

router.get("/diseases", OphthalmologyTreatmentController.getDiseaseNames);

router.get("/search", OphthalmologyTreatmentController.searchTreatments);
// Query params: q (query), page, limit

router.get("/disease/:diseaseName", OphthalmologyTreatmentController.getTreatmentByDiseaseName);

router.get("/:id", OphthalmologyTreatmentController.getTreatmentById);

// POST requests (Admin only)
router.post("/", [Auth], OphthalmologyTreatmentController.createTreatment);

// PUT requests (Admin only)
router.put("/:id", [Auth], OphthalmologyTreatmentController.updateTreatment);

// DELETE requests (Admin only)
router.delete("/:id", [Auth], OphthalmologyTreatmentController.deleteTreatment);

module.exports = { OphthalmologyTreatmentRouter: router };
