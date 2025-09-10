const HttpError = require("../helpers/HttpError.helpers");
const Response = require("../helpers/Response.helpers");
const { StatisticsService } = require("../services/statistics.service");

class StatisticsController {
  // Get dashboard statistics
  getDashboardStats = async (req, res) => {
    const stats = await StatisticsService.getDashboardStats();
    Response(res).body(stats).send();
  };

  // Get doctor statistics
  getDoctorStats = async (req, res) => {
    const stats = await StatisticsService.getDoctorStats();
    Response(res).body(stats).send();
  };

  // Get booking statistics
  getBookingStats = async (req, res) => {
    const stats = await StatisticsService.getBookingStats();
    Response(res).body(stats).send();
  };

  // Get clinic statistics
  getClinicStats = async (req, res) => {
    const stats = await StatisticsService.getClinicStats();
    Response(res).body(stats).send();
  };

  // Get appointment statistics
  getAppointmentStats = async (req, res) => {
    const stats = await StatisticsService.getAppointmentStats();
    Response(res).body(stats).send();
  };

  // Get specialty statistics
  getSpecialtyStats = async (req, res) => {
    const stats = await StatisticsService.getSpecialtyStats();
    Response(res).body(stats).send();
  };

  // Get monthly data
  getMonthlyData = async (req, res) => {
    const data = await StatisticsService.getMonthlyData();
    Response(res).body(data).send();
  };
}

module.exports = { StatisticsController: new StatisticsController() };
