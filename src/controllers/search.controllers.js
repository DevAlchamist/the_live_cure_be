const { SearchService } = require("../services/search.service");
const { ResponseHelper } = require("../helpers/Response.helpers");

class SearchController {
  static async globalSearch(req, res) {
    try {
      const { q, type, page = 1, limit } = req.query;

      if (!q) {
        return ResponseHelper.error(res, "Search query is required", 400);
      }

      const results = await SearchService.globalSearch({
        query: q,
        type,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      ResponseHelper.success(res, "Global search completed", results);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async searchDoctors(req, res) {
    try {
      const { q, specialty, city, rating, fees, page = 1, limit  } = req.query;

      const results = await SearchService.searchDoctors({
        query: q,
        specialty,
        city,
        rating: rating ? parseFloat(rating) : undefined,
        fees: fees ? parseFloat(fees) : undefined,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      ResponseHelper.success(res, "Doctors search completed", results);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async searchClinics(req, res) {
    try {
      const { q, type, city, amenities, page = 1, limit } = req.query;

      const results = await SearchService.searchClinics({
        query: q,
        type,
        city,
        amenities: amenities ? amenities.split(',') : undefined,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      ResponseHelper.success(res, "Clinics search completed", results);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async searchBlogs(req, res) {
    try {
      const { q, category, page = 1, limit } = req.query;

      const results = await SearchService.searchBlogs({
        query: q,
        category,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      ResponseHelper.success(res, "Blogs search completed", results);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async searchTreatments(req, res) {
    try {
      const { q, disease, page = 1, limit } = req.query;

      const results = await SearchService.searchTreatments({
        query: q,
        disease,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      ResponseHelper.success(res, "Treatments search completed", results);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async searchPatientStories(req, res) {
    try {
      const { q, condition, page = 1, limit } = req.query;

      const results = await SearchService.searchPatientStories({
        query: q,
        condition,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      ResponseHelper.success(res, "Patient stories search completed", results);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async searchAppointments(req, res) {
    try {
      const { q, status, date, doctor, patient, page = 1, limit } = req.query;
      const userId = req.user.id;

      const results = await SearchService.searchAppointments({
        query: q,
        status,
        date,
        doctor,
        patient,
        userId,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      ResponseHelper.success(res, "Appointments search completed", results);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async getSearchSuggestions(req, res) {
    try {
      const { q, type, limit = 5 } = req.query;

      if (!q) {
        return ResponseHelper.error(res, "Search query is required", 400);
      }

      const suggestions = await SearchService.getSearchSuggestions({
        query: q,
        type,
        limit: parseInt(limit)
      });

      ResponseHelper.success(res, "Search suggestions retrieved", suggestions);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }
}

module.exports = { SearchController };
