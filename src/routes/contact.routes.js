const express = require("express");
const { ContactInquiryController } = require("../controllers/contactInquiry.controllers");
const { Auth } = require("../middlewares/auth.middlewares");

const router = express.Router();

// GET requests - Admin endpoints
router.get("/", [Auth], ContactInquiryController.getAllInquiries);
// Query params: page, limit, search, sort, type, status, priority, assignedTo

router.get("/stats", [Auth], ContactInquiryController.getInquiryStatistics);

router.get("/recent", [Auth], ContactInquiryController.getRecentInquiries);
// Query params: limit

router.get("/new", [Auth], ContactInquiryController.getNewInquiries);
// Query params: page, limit

router.get("/urgent", [Auth], ContactInquiryController.getUrgentInquiries);
// Query params: page, limit

router.get("/status/:status", [Auth], ContactInquiryController.getInquiriesByStatus);
// Query params: page, limit

router.get("/type/:type", [Auth], ContactInquiryController.getInquiriesByType);
// Query params: page, limit

router.get("/:id", [Auth], ContactInquiryController.getInquiryById);

// POST requests - Public endpoints
router.post("/inquiry", ContactInquiryController.createInquiry);
router.post("/appointment-request", ContactInquiryController.submitAppointmentRequest);

// PUT requests (Admin only)
router.put("/:id", [Auth], ContactInquiryController.updateInquiry);
router.put("/:id/assign", [Auth], ContactInquiryController.assignInquiry);
router.put("/:id/respond", [Auth], ContactInquiryController.respondToInquiry);
router.put("/:id/status", [Auth], ContactInquiryController.updateInquiryStatus);

// DELETE requests (Admin only)
router.delete("/:id", [Auth], ContactInquiryController.deleteInquiry);

module.exports = { ContactRouter: router };
