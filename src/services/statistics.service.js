const Doctor = require("../models/Doctor.model");
const Clinic = require("../models/Clinic.model");
const Appointment = require("../models/Appointment.model");
const ContactInquiry = require("../models/ContactInquiry.model");

class StatisticsService {
  // Get dashboard statistics
  getDashboardStats = async () => {
    const [
      totalDoctors,
      totalClinics,
      totalAppointments,
      totalInquiries,
      appointmentStats,
      specialtyStats,
      monthlyData
    ] = await Promise.all([
      Doctor.countDocuments(),
      Clinic.countDocuments(),
      Appointment.countDocuments(),
      ContactInquiry.countDocuments(),
      this.getAppointmentStats(),
      this.getSpecialtyStats(),
      this.getMonthlyData()
    ]);

    return {
      totalDoctors,
      totalClinics,
      totalAppointments,
      totalInquiries,
      confirmedAppointments: appointmentStats.confirmed,
      pendingAppointments: appointmentStats.pending,
      completedAppointments: appointmentStats.completed,
      cancelledAppointments: appointmentStats.cancelled,
      bookingStats: appointmentStats,
      specialtyStats,
      monthlyData
    };
  };

  // Get appointment statistics
  getAppointmentStats = async () => {
    const stats = await Appointment.aggregate([
      {
        $group: {
          _id: null,
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          confirmed: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } }
        }
      }
    ]);

    return stats[0] || { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
  };

  // Get specialty statistics
  getSpecialtyStats = async () => {
    const stats = await Doctor.aggregate([
      { $unwind: '$acfData.specializations' },
      {
        $group: {
          _id: '$acfData.specializations',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    return stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});
  };

  // Get monthly data for charts
  getMonthlyData = async () => {
    const currentYear = new Date().getFullYear();
    const monthlyData = [];

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(currentYear, month - 1, 1);
      const endDate = new Date(currentYear, month, 0);

      const count = await Appointment.countDocuments({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      });

      monthlyData.push({
        month: startDate.toLocaleString('default', { month: 'short' }),
        bookings: count
      });
    }

    return monthlyData;
  };

  // Get doctor statistics
  getDoctorStats = async () => {
    const [
      totalDoctors,
      activeDoctors,
      inactiveDoctors,
      topRatedDoctors,
      doctorsByCity
    ] = await Promise.all([
      Doctor.countDocuments(),
      Doctor.countDocuments({ 'acfData.status': 'active' }),
      Doctor.countDocuments({ 'acfData.status': 'inactive' }),
      Doctor.find()
        .sort({ 'acfData.personal_details.rating': -1 })
        .limit(5)
        .select('acfData.personal_details.name acfData.personal_details.rating acfData.personal_details.speciality'),
      this.getDoctorsByCity()
    ]);

    return {
      totalDoctors,
      activeDoctors,
      inactiveDoctors,
      topRatedDoctors,
      doctorsByCity
    };
  };

  // Get doctors by city
  getDoctorsByCity = async () => {
    const stats = await Doctor.aggregate([
      { $unwind: '$acfData.cities' },
      {
        $group: {
          _id: '$acfData.cities.cityname',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    return stats;
  };

  // Get clinic statistics
  getClinicStats = async () => {
    const [
      totalClinics,
      activeClinics,
      inactiveClinics,
      clinicsByType,
      clinicsByCity
    ] = await Promise.all([
      Clinic.countDocuments(),
      Clinic.countDocuments({ status: 'active' }),
      Clinic.countDocuments({ status: 'inactive' }),
      this.getClinicsByType(),
      this.getClinicsByCity()
    ]);

    return {
      totalClinics,
      activeClinics,
      inactiveClinics,
      clinicsByType,
      clinicsByCity
    };
  };

  // Get clinics by type
  getClinicsByType = async () => {
    const stats = await Clinic.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return stats;
  };

  // Get clinics by city
  getClinicsByCity = async () => {
    const stats = await Clinic.aggregate([
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    return stats;
  };

  // Get booking statistics
  getBookingStats = async () => {
    const [
      totalBookings,
      todayBookings,
      thisWeekBookings,
      thisMonthBookings,
      statusBreakdown,
      paymentBreakdown
    ] = await Promise.all([
      Appointment.countDocuments(),
      this.getTodayBookings(),
      this.getThisWeekBookings(),
      this.getThisMonthBookings(),
      this.getAppointmentStats(),
      this.getPaymentStats()
    ]);

    return {
      totalBookings,
      todayBookings,
      thisWeekBookings,
      thisMonthBookings,
      statusBreakdown,
      paymentBreakdown
    };
  };

  // Get today's bookings
  getTodayBookings = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await Appointment.countDocuments({
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    });
  };

  // Get this week's bookings
  getThisWeekBookings = async () => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return await Appointment.countDocuments({
      createdAt: { $gte: startOfWeek }
    });
  };

  // Get this month's bookings
  getThisMonthBookings = async () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return await Appointment.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
  };

  // Get payment statistics
  getPaymentStats = async () => {
    const stats = await Appointment.aggregate([
      {
        $group: {
          _id: null,
          pending: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] } },
          paid: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'failed'] }, 1, 0] } },
          refunded: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'refunded'] }, 1, 0] } }
        }
      }
    ]);

    return stats[0] || { pending: 0, paid: 0, failed: 0, refunded: 0 };
  };
}

module.exports = { StatisticsService: new StatisticsService() };
