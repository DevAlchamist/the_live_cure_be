const express = require("express");
const { AppointmentController } = require("../controllers/appointment.controllers");
const { Auth } = require("../middlewares/auth.middlewares");

const router = express.Router();

// GET requests - Admin endpoints with comprehensive query support
router.get("/", [Auth], AppointmentController.getAllAppointments);
// Query params: page, limit, search, sort, patientName, patientEmail, patientMobile, 
// patientGender, patientAge, minAge, maxAge, city, treatmentType, doctorName, doctorId, 
// clinicId, status, paymentStatus, preferredDate, startDate, endDate, bookingDate, 
// confirmedDate, consultationFees, minFees, maxFees

// Status-based endpoints
router.get("/pending", [Auth], AppointmentController.getPendingAppointments);
router.get("/status/:status", [Auth], AppointmentController.getAppointmentsByStatus);

// Time-based endpoints
router.get("/today", [Auth], AppointmentController.getTodaysAppointments);
router.get("/upcoming", [Auth], AppointmentController.getUpcomingAppointments);
router.get("/date-range", [Auth], AppointmentController.getAppointmentsByDateRange);

// Entity-based endpoints
router.get("/doctor/:doctorId", [Auth], AppointmentController.getAppointmentsByDoctor);
router.get("/clinic/:clinicId", [Auth], AppointmentController.getAppointmentsByClinic);
router.get("/patient/:patientEmail", [Auth], AppointmentController.getAppointmentsByPatient);

router.get("/:appointmentId", [Auth], AppointmentController.getAppointmentById); // Appointment details

// POST requests
router.post("/", AppointmentController.createAppointment); // Public endpoint for booking

// PUT requests (Admin only)
router.put("/:appointmentId", [Auth], AppointmentController.updateAppointment);
router.put("/:appointmentId/status", [Auth], AppointmentController.updateAppointmentStatus);
router.put("/:appointmentId/confirm", [Auth], AppointmentController.confirmAppointment);
router.put("/:appointmentId/cancel", [Auth], AppointmentController.cancelAppointment);
router.put("/:appointmentId/reschedule", [Auth], AppointmentController.rescheduleAppointment);
router.put("/:appointmentId/complete", [Auth], AppointmentController.completeAppointment);
router.put("/:appointmentId/payment", [Auth], AppointmentController.updatePaymentStatus);

// DELETE requests (Admin only)
router.delete("/:appointmentId", [Auth], AppointmentController.deleteAppointment);

module.exports.AppointmentRouter = router;
