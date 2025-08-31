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

router.get("/search", [Auth], AppointmentController.searchAppointments); // Advanced search
// Query params: q (query), filters (JSON string), dateRange

router.get("/stats", [Auth], AppointmentController.getAppointmentStats); // Appointment statistics
router.get("/analytics", [Auth], AppointmentController.getAppointmentAnalytics); // Advanced analytics
router.get("/reports", [Auth], AppointmentController.getAppointmentReports); // Generate reports

// Status-based endpoints
router.get("/pending", [Auth], AppointmentController.getPendingAppointments);
router.get("/confirmed", [Auth], AppointmentController.getConfirmedAppointments);
router.get("/completed", [Auth], AppointmentController.getCompletedAppointments);
router.get("/cancelled", [Auth], AppointmentController.getCancelledAppointments);
router.get("/rescheduled", [Auth], AppointmentController.getRescheduledAppointments);
router.get("/status/:status", [Auth], AppointmentController.getAppointmentsByStatus);

// Time-based endpoints
router.get("/today", [Auth], AppointmentController.getTodaysAppointments);
router.get("/tomorrow", [Auth], AppointmentController.getTomorrowsAppointments);
router.get("/this-week", [Auth], AppointmentController.getThisWeeksAppointments);
router.get("/this-month", [Auth], AppointmentController.getThisMonthsAppointments);
router.get("/upcoming", [Auth], AppointmentController.getUpcomingAppointments);
router.get("/overdue", [Auth], AppointmentController.getOverdueAppointments);
router.get("/date-range", [Auth], AppointmentController.getAppointmentsByDateRange);
router.get("/date/:date", [Auth], AppointmentController.getAppointmentsByDate);

// Entity-based endpoints
router.get("/doctor/:doctorId", [Auth], AppointmentController.getAppointmentsByDoctor);
router.get("/clinic/:clinicId", [Auth], AppointmentController.getAppointmentsByClinic);
router.get("/patient/:patientEmail", [Auth], AppointmentController.getAppointmentsByPatient);
router.get("/treatment/:treatmentType", [Auth], AppointmentController.getAppointmentsByTreatment);
router.get("/city/:city", [Auth], AppointmentController.getAppointmentsByCity);

// Payment-based endpoints
router.get("/payment/pending", [Auth], AppointmentController.getPendingPayments);
router.get("/payment/paid", [Auth], AppointmentController.getPaidAppointments);
router.get("/payment/failed", [Auth], AppointmentController.getFailedPayments);
router.get("/payment/refunded", [Auth], AppointmentController.getRefundedAppointments);

// Age and demographic endpoints
router.get("/demographics", [Auth], AppointmentController.getAppointmentDemographics);
router.get("/age-groups", [Auth], AppointmentController.getAppointmentsByAgeGroup);
router.get("/gender/:gender", [Auth], AppointmentController.getAppointmentsByGender);

// Export endpoints
router.get("/export/csv", [Auth], AppointmentController.exportAppointmentsCSV);
router.get("/export/excel", [Auth], AppointmentController.exportAppointmentsExcel);
router.get("/export/pdf", [Auth], AppointmentController.exportAppointmentsPDF);

// Calendar endpoints
router.get("/calendar", [Auth], AppointmentController.getAppointmentCalendar);
router.get("/calendar/:year/:month", [Auth], AppointmentController.getMonthlyCalendar);

// Notification endpoints
router.get("/notifications/due", [Auth], AppointmentController.getDueNotifications);
router.get("/reminders", [Auth], AppointmentController.getAppointmentReminders);

router.get("/:appointmentId", [Auth], AppointmentController.getAppointmentById); // Appointment details
router.get("/:appointmentId/history", [Auth], AppointmentController.getAppointmentHistory); // Status history

// POST requests
router.post("/", AppointmentController.createAppointment); // Public endpoint for booking
router.post("/bulk", [Auth], AppointmentController.createBulkAppointments); // Bulk create (Admin)
router.post("/validate", AppointmentController.validateAppointmentSlot); // Public validation
router.post("/check-availability", AppointmentController.checkDoctorAvailability); // Public availability check
router.post("/:appointmentId/notes", [Auth], AppointmentController.addAppointmentNote); // Add notes
router.post("/:appointmentId/send-reminder", [Auth], AppointmentController.sendAppointmentReminder); // Send reminder

// PUT requests (Admin only)
router.put("/:appointmentId", [Auth], AppointmentController.updateAppointment);
router.put("/:appointmentId/status", [Auth], AppointmentController.updateAppointmentStatus);
router.put("/:appointmentId/confirm", [Auth], AppointmentController.confirmAppointment);
router.put("/:appointmentId/cancel", [Auth], AppointmentController.cancelAppointment);
router.put("/:appointmentId/reschedule", [Auth], AppointmentController.rescheduleAppointment);
router.put("/:appointmentId/complete", [Auth], AppointmentController.completeAppointment);
router.put("/:appointmentId/payment", [Auth], AppointmentController.updatePaymentStatus);
router.put("/:appointmentId/fees", [Auth], AppointmentController.updateConsultationFees);
router.put("/bulk/status", [Auth], AppointmentController.bulkUpdateStatus); // Bulk status update
router.put("/bulk/confirm", [Auth], AppointmentController.bulkConfirmAppointments); // Bulk confirm
router.put("/bulk/cancel", [Auth], AppointmentController.bulkCancelAppointments); // Bulk cancel

// PATCH requests (Admin only)
router.patch("/:appointmentId/patient", [Auth], AppointmentController.updatePatientInfo);
router.patch("/:appointmentId/doctor", [Auth], AppointmentController.assignDoctor);
router.patch("/:appointmentId/clinic", [Auth], AppointmentController.assignClinic);

// DELETE requests (Admin only)
router.delete("/:appointmentId", [Auth], AppointmentController.deleteAppointment);
router.delete("/bulk", [Auth], AppointmentController.bulkDeleteAppointments); // Bulk delete
router.delete("/:appointmentId/notes/:noteId", [Auth], AppointmentController.removeAppointmentNote);

module.exports.AppointmentRouter = router;
