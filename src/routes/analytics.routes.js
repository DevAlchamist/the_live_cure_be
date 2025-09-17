const express = require("express");
const { Auth } = require("../middlewares/auth.middlewares");
const { AnalyticsController } = require("../controllers/analytics.controllers");

const router = express.Router();

// GET requests - Protected endpoints (Admin only)
router.get("/visits", [Auth], AnalyticsController.getVisitAnalytics);
// Query params: startDate, endDate, period (daily, weekly, monthly)

router.get("/conversions", [Auth], AnalyticsController.getConversionAnalytics);
// Query params: startDate, endDate, type (appointments, registrations, inquiries)

router.get("/revenue", [Auth], AnalyticsController.getRevenueAnalytics);
// Query params: startDate, endDate, period (daily, weekly, monthly)

router.get("/user-engagement", [Auth], AnalyticsController.getUserEngagementAnalytics);
// Query params: startDate, endDate, period

router.get("/doctor-performance", [Auth], AnalyticsController.getDoctorPerformanceAnalytics);
// Query params: startDate, endDate, doctorId

router.get("/clinic-performance", [Auth], AnalyticsController.getClinicPerformanceAnalytics);
// Query params: startDate, endDate, clinicId

router.get("/content-performance", [Auth], AnalyticsController.getContentPerformanceAnalytics);
// Query params: startDate, endDate, type (blogs, stories, treatments)

router.get("/geographic-distribution", [Auth], AnalyticsController.getGeographicDistribution);
// Query params: startDate, endDate, type (patients, doctors, clinics)

router.get("/device-analytics", [Auth], AnalyticsController.getDeviceAnalytics);
// Query params: startDate, endDate

router.get("/traffic-sources", [Auth], AnalyticsController.getTrafficSources);
// Query params: startDate, endDate

module.exports.AnalyticsRouter = router;
