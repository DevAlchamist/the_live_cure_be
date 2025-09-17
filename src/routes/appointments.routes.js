const express = require("express");
const {
  AppointmentController,
} = require("../controllers/appointment.controllers");
const { Auth } = require("../middlewares/auth.middlewares");

const router = express.Router();

// GET requests - Admin endpoints with comprehensive query support
router.get(
  "/", //[Auth]
  AppointmentController.getAllAppointments
);
// Query params: page, limit, search, sort, patientName, patientEmail, patientMobile,
// patientGender, patientAge, minAge, maxAge, city, treatmentType, doctorName, doctorId,
// clinicId, status, paymentStatus, preferredDate, startDate, endDate, bookingDate,
// confirmedDate, consultationFees, minFees, maxFees

// Status-based endpoints
router.get(
  "/pending", //[Auth]
  AppointmentController.getPendingAppointments
);
router.get(
  "/status/:status", //[Auth]
  AppointmentController.getAppointmentsByStatus
);

// Time-based endpoints
router.get(
  "/today", //[Auth]
  AppointmentController.getTodaysAppointments
);
router.get(
  "/upcoming", //[Auth]
  AppointmentController.getUpcomingAppointments
);
router.get(
  "/date-range", //[Auth]
  AppointmentController.getAppointmentsByDateRange
);

// Entity-based endpoints
router.get(
  "/doctor/:doctorId", //[Auth]
  AppointmentController.getAppointmentsByDoctor
);
router.get(
  "/clinic/:clinicId", //[Auth]
  AppointmentController.getAppointmentsByClinic
);
router.get(
  "/patient/:patientId", //[Auth]
  AppointmentController.getAppointmentsByPatient
);

// Additional booking queries (commented out until methods are implemented)
// router.get(
//   "/search", //[Auth]
//   AppointmentController.searchAppointments
// );
router.get(
  "/stats", //[Auth]
  AppointmentController.getAppointmentStats
);
// router.get(
//   "/history/:patientId", //[Auth]
//   AppointmentController.getBookingHistory
// );
// router.get(
//   "/upcoming/:patientId", //[Auth]
//   AppointmentController.getUpcomingBookings
// );
// router.get(
//   "/today/:doctorId", //[Auth]
//   AppointmentController.getTodaysBookings
// );

// Availability & Time Slots (commented out until methods are implemented)
// router.post(
//   "/check-availability", //[Auth]
//   AppointmentController.checkAvailability
// );
// router.get(
//   "/available-slots", //[Auth]
//   AppointmentController.getAvailableSlots
// );

router.get(
  "/:appointmentId", //[Auth]
  AppointmentController.getAppointmentById
); // Appointment details

// POST requests
router.post("/", AppointmentController.createAppointment); // Public endpoint for booking

// PUT requests (Admin only)
router.put(
  "/:appointmentId", //[Auth]
  AppointmentController.updateAppointment
);
router.put(
  "/:appointmentId/status", //[Auth]
  AppointmentController.updateAppointmentStatus
);
router.put(
  "/:appointmentId/confirm", //[Auth]
  AppointmentController.confirmAppointment
);
router.put(
  "/:appointmentId/cancel", //[Auth]
  AppointmentController.cancelAppointment
);
router.put(
  "/:appointmentId/reschedule", //[Auth]
  AppointmentController.rescheduleAppointment
);
router.put(
  "/:appointmentId/complete", //[Auth]
  AppointmentController.completeAppointment
);
router.put(
  "/:appointmentId/payment", //[Auth]
  AppointmentController.updatePaymentStatus
);

// Additional appointment actions (commented out until methods are implemented)
// router.post(
//   "/:appointmentId/reminder", //[Auth]
//   AppointmentController.sendBookingReminder
// );
// router.post(
//   "/:appointmentId/notes", //[Auth]
//   AppointmentController.addBookingNotes
// );

// DELETE requests (Admin only)
router.delete(
  "/:appointmentId", //[Auth]
  AppointmentController.deleteAppointment
);

module.exports.AppointmentRouter = router;
