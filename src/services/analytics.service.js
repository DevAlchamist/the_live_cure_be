const { AppointmentModel } = require("../models/Appointment.model");
const { DoctorModel } = require("../models/Doctor.model");
const { ClinicModel } = require("../models/Clinic.model");
const { BlogModel } = require("../models/Blog.model");
const { PatientStoryModel } = require("../models/PatientStory.model");
const { UserModel } = require("../models/Users.modal");

class AnalyticsService {
  static async getVisitAnalytics({ startDate, endDate, period }) {
    try {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);

      const query = {};
      if (Object.keys(dateFilter).length > 0) {
        query.createdAt = dateFilter;
      }

      // This is a placeholder - in a real application, you'd track visits separately
      const visits = await UserModel.aggregate([
        { $match: query },
        {
          $group: {
            _id: {
              $dateToString: {
                format: period === 'daily' ? '%Y-%m-%d' : period === 'weekly' ? '%Y-%U' : '%Y-%m',
                date: '$createdAt'
              }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      return { visits };
    } catch (error) {
      throw new Error(`Error getting visit analytics: ${error.message}`);
    }
  }

  static async getConversionAnalytics({ startDate, endDate, type }) {
    try {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);

      const query = {};
      if (Object.keys(dateFilter).length > 0) {
        query.createdAt = dateFilter;
      }

      const conversions = {};

      if (!type || type === 'appointments') {
        conversions.appointments = await AppointmentModel.countDocuments(query);
      }

      if (!type || type === 'registrations') {
        conversions.registrations = await UserModel.countDocuments(query);
      }

      if (!type || type === 'inquiries') {
        // Assuming you have a ContactInquiry model
        conversions.inquiries = 0; // Placeholder
      }

      return { conversions };
    } catch (error) {
      throw new Error(`Error getting conversion analytics: ${error.message}`);
    }
  }

  static async getRevenueAnalytics({ startDate, endDate, period }) {
    try {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);

      const query = { status: 'completed' };
      if (Object.keys(dateFilter).length > 0) {
        query.createdAt = dateFilter;
      }

      const revenue = await AppointmentModel.aggregate([
        { $match: query },
        {
          $group: {
            _id: {
              $dateToString: {
                format: period === 'daily' ? '%Y-%m-%d' : period === 'weekly' ? '%Y-%U' : '%Y-%m',
                date: '$createdAt'
              }
            },
            totalRevenue: { $sum: '$consultationFees' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      return { revenue };
    } catch (error) {
      throw new Error(`Error getting revenue analytics: ${error.message}`);
    }
  }

  static async getUserEngagementAnalytics({ startDate, endDate, period }) {
    try {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);

      const query = {};
      if (Object.keys(dateFilter).length > 0) {
        query.createdAt = dateFilter;
      }

      const engagement = await UserModel.aggregate([
        { $match: query },
        {
          $group: {
            _id: {
              $dateToString: {
                format: period === 'daily' ? '%Y-%m-%d' : period === 'weekly' ? '%Y-%U' : '%Y-%m',
                date: '$createdAt'
              }
            },
            newUsers: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      return { engagement };
    } catch (error) {
      throw new Error(`Error getting user engagement analytics: ${error.message}`);
    }
  }

  static async getDoctorPerformanceAnalytics({ startDate, endDate, doctorId }) {
    try {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);

      const query = {};
      if (doctorId) query.doctorId = doctorId;
      if (Object.keys(dateFilter).length > 0) {
        query.createdAt = dateFilter;
      }

      const performance = await AppointmentModel.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$doctorId',
            totalAppointments: { $sum: 1 },
            completedAppointments: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            totalRevenue: { $sum: '$consultationFees' },
            averageRating: { $avg: '$rating' }
          }
        },
        {
          $lookup: {
            from: 'doctors',
            localField: '_id',
            foreignField: '_id',
            as: 'doctor'
          }
        }
      ]);

      return { performance };
    } catch (error) {
      throw new Error(`Error getting doctor performance analytics: ${error.message}`);
    }
  }

  static async getClinicPerformanceAnalytics({ startDate, endDate, clinicId }) {
    try {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);

      const query = {};
      if (clinicId) query.clinicId = clinicId;
      if (Object.keys(dateFilter).length > 0) {
        query.createdAt = dateFilter;
      }

      const performance = await AppointmentModel.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$clinicId',
            totalAppointments: { $sum: 1 },
            completedAppointments: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            totalRevenue: { $sum: '$consultationFees' }
          }
        },
        {
          $lookup: {
            from: 'clinics',
            localField: '_id',
            foreignField: '_id',
            as: 'clinic'
          }
        }
      ]);

      return { performance };
    } catch (error) {
      throw new Error(`Error getting clinic performance analytics: ${error.message}`);
    }
  }

  static async getContentPerformanceAnalytics({ startDate, endDate, type }) {
    try {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);

      const query = {};
      if (Object.keys(dateFilter).length > 0) {
        query.createdAt = dateFilter;
      }

      const performance = {};

      if (!type || type === 'blogs') {
        performance.blogs = await BlogModel.aggregate([
          { $match: query },
          {
            $group: {
              _id: null,
              totalBlogs: { $sum: 1 },
              totalViews: { $sum: '$views' },
              averageRating: { $avg: '$rating' }
            }
          }
        ]);
      }

      if (!type || type === 'stories') {
        performance.stories = await PatientStoryModel.aggregate([
          { $match: query },
          {
            $group: {
              _id: null,
              totalStories: { $sum: 1 },
              totalViews: { $sum: '$views' },
              averageRating: { $avg: '$rating' }
            }
          }
        ]);
      }

      return { performance };
    } catch (error) {
      throw new Error(`Error getting content performance analytics: ${error.message}`);
    }
  }

  static async getGeographicDistribution({ startDate, endDate, type }) {
    try {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);

      const query = {};
      if (Object.keys(dateFilter).length > 0) {
        query.createdAt = dateFilter;
      }

      const distribution = {};

      if (!type || type === 'patients') {
        distribution.patients = await UserModel.aggregate([
          { $match: query },
          {
            $group: {
              _id: '$city',
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ]);
      }

      if (!type || type === 'doctors') {
        distribution.doctors = await DoctorModel.aggregate([
          { $match: query },
          { $unwind: '$cities' },
          {
            $group: {
              _id: '$cities',
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ]);
      }

      if (!type || type === 'clinics') {
        distribution.clinics = await ClinicModel.aggregate([
          { $match: query },
          {
            $group: {
              _id: '$city',
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ]);
      }

      return { distribution };
    } catch (error) {
      throw new Error(`Error getting geographic distribution: ${error.message}`);
    }
  }

  static async getDeviceAnalytics({ startDate, endDate }) {
    try {
      // This is a placeholder - in a real application, you'd track device information
      const deviceAnalytics = {
        desktop: 60,
        mobile: 35,
        tablet: 5
      };

      return { deviceAnalytics };
    } catch (error) {
      throw new Error(`Error getting device analytics: ${error.message}`);
    }
  }

  static async getTrafficSources({ startDate, endDate }) {
    try {
      // This is a placeholder - in a real application, you'd track traffic sources
      const trafficSources = {
        direct: 40,
        search: 30,
        social: 20,
        referral: 10
      };

      return { trafficSources };
    } catch (error) {
      throw new Error(`Error getting traffic sources: ${error.message}`);
    }
  }
}

module.exports = { AnalyticsService };
