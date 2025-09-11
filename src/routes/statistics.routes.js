const express = require("express");
const {
  StatisticsController,
} = require("../controllers/statistics.controllers");
const { Auth } = require("../middlewares/auth.middlewares");

const router = express.Router();

// GET requests - Admin endpoints
router.get(
  "/dashboard", //[Auth]
  StatisticsController.getDashboardStats
);
router.get(
  "/doctors", //[Auth]
  StatisticsController.getDoctorStats
);
router.get(
  "/bookings", //[Auth]
  StatisticsController.getBookingStats
);
router.get(
  "/clinics", //[Auth]
  StatisticsController.getClinicStats
);
router.get(
  "/appointments", //[Auth]
  StatisticsController.getAppointmentStats
);
router.get(
  "/specialties", //[Auth]
  StatisticsController.getSpecialtyStats
);
router.get(
  "/monthly", //[Auth]
  StatisticsController.getMonthlyData
);

module.exports = { StatisticsRouter: router };
