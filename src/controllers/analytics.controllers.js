const { AnalyticsService } = require("../services/analytics.service");
const { ResponseHelper } = require("../helpers/Response.helpers");

class AnalyticsController {
  static async getVisitAnalytics(req, res) {
    try {
      const { startDate, endDate, period = 'daily' } = req.query;

      const analytics = await AnalyticsService.getVisitAnalytics({
        startDate,
        endDate,
        period
      });

      ResponseHelper.success(res, "Visit analytics retrieved successfully", analytics);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async getConversionAnalytics(req, res) {
    try {
      const { startDate, endDate, type } = req.query;

      const analytics = await AnalyticsService.getConversionAnalytics({
        startDate,
        endDate,
        type
      });

      ResponseHelper.success(res, "Conversion analytics retrieved successfully", analytics);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async getRevenueAnalytics(req, res) {
    try {
      const { startDate, endDate, period = 'monthly' } = req.query;

      const analytics = await AnalyticsService.getRevenueAnalytics({
        startDate,
        endDate,
        period
      });

      ResponseHelper.success(res, "Revenue analytics retrieved successfully", analytics);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async getUserEngagementAnalytics(req, res) {
    try {
      const { startDate, endDate, period = 'daily' } = req.query;

      const analytics = await AnalyticsService.getUserEngagementAnalytics({
        startDate,
        endDate,
        period
      });

      ResponseHelper.success(res, "User engagement analytics retrieved successfully", analytics);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async getDoctorPerformanceAnalytics(req, res) {
    try {
      const { startDate, endDate, doctorId } = req.query;

      const analytics = await AnalyticsService.getDoctorPerformanceAnalytics({
        startDate,
        endDate,
        doctorId
      });

      ResponseHelper.success(res, "Doctor performance analytics retrieved successfully", analytics);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async getClinicPerformanceAnalytics(req, res) {
    try {
      const { startDate, endDate, clinicId } = req.query;

      const analytics = await AnalyticsService.getClinicPerformanceAnalytics({
        startDate,
        endDate,
        clinicId
      });

      ResponseHelper.success(res, "Clinic performance analytics retrieved successfully", analytics);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async getContentPerformanceAnalytics(req, res) {
    try {
      const { startDate, endDate, type } = req.query;

      const analytics = await AnalyticsService.getContentPerformanceAnalytics({
        startDate,
        endDate,
        type
      });

      ResponseHelper.success(res, "Content performance analytics retrieved successfully", analytics);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async getGeographicDistribution(req, res) {
    try {
      const { startDate, endDate, type } = req.query;

      const analytics = await AnalyticsService.getGeographicDistribution({
        startDate,
        endDate,
        type
      });

      ResponseHelper.success(res, "Geographic distribution analytics retrieved successfully", analytics);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async getDeviceAnalytics(req, res) {
    try {
      const { startDate, endDate } = req.query;

      const analytics = await AnalyticsService.getDeviceAnalytics({
        startDate,
        endDate
      });

      ResponseHelper.success(res, "Device analytics retrieved successfully", analytics);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async getTrafficSources(req, res) {
    try {
      const { startDate, endDate } = req.query;

      const analytics = await AnalyticsService.getTrafficSources({
        startDate,
        endDate
      });

      ResponseHelper.success(res, "Traffic sources analytics retrieved successfully", analytics);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }
}

module.exports = { AnalyticsController };
