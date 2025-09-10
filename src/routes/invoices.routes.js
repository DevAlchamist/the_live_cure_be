const express = require("express");
const { InvoiceController } = require("../controllers/invoice.controllers");
const { Auth } = require("../middlewares/auth.middlewares");

const router = express.Router();

// GET requests - Admin endpoints
router.get("/", [Auth], InvoiceController.getAllInvoices);
// Query params: page, limit, search, sort, status, paymentMethod, startDate, endDate, minAmount, maxAmount

router.get("/stats", [Auth], InvoiceController.getInvoiceStatistics);

router.get("/pending", [Auth], InvoiceController.getPendingInvoices);
// Query params: page, limit

router.get("/overdue", [Auth], InvoiceController.getOverdueInvoices);
// Query params: page, limit

router.get("/paid", [Auth], InvoiceController.getPaidInvoices);
// Query params: page, limit

router.get("/recent", [Auth], InvoiceController.getRecentInvoices);
// Query params: limit

router.get("/appointment/:appointmentId", [Auth], InvoiceController.getInvoiceByAppointment);

router.get("/number/:invoiceNumber", [Auth], InvoiceController.getInvoiceByNumber);

router.get("/:id", [Auth], InvoiceController.getInvoiceById);

// POST requests
router.post("/", [Auth], InvoiceController.createInvoice);
router.post("/generate/:appointmentId", [Auth], InvoiceController.generateFromAppointment);

// PUT requests (Admin only)
router.put("/:id", [Auth], InvoiceController.updateInvoice);
router.put("/:id/status", [Auth], InvoiceController.updateInvoiceStatus);
router.put("/:id/paid", [Auth], InvoiceController.markAsPaid);
router.put("/:id/send-email", [Auth], InvoiceController.sendInvoiceEmail);

// DELETE requests (Admin only)
router.delete("/:id", [Auth], InvoiceController.deleteInvoice);

module.exports = { InvoiceRouter: router };
