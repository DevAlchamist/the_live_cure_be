const { Appointment } = require("../models/Appointment.model");
const BasicServices = require("./basic.service");

class AppointmentService extends BasicServices {
  constructor() {
    super(Appointment);
  }

  // Create appointment with automatic booking date
  createAppointment = (appointmentData) => {
    return this.create({
      ...appointmentData,
      bookingDate: new Date()
    });
  };

  // Advanced search with text search and filters
  searchAppointments = async (searchQuery, filters = {}, options = {}) => {
    const query = {};

    // Text search across multiple fields
    if (searchQuery) {
      query.$text = { $search: searchQuery };
    }

    // Apply filters
    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.patientEmail) {
      query.patientEmail = new RegExp(filters.patientEmail, 'i');
    }

    if (filters.doctorId) {
      query.doctorId = filters.doctorId;
    }

    if (filters.clinicId) {
      query.clinicId = filters.clinicId;
    }

    if (filters.city) {
      query.city = new RegExp(filters.city, 'i');
    }

    if (filters.treatmentType) {
      query.treatmentType = new RegExp(filters.treatmentType, 'i');
    }

    if (filters.patientGender) {
      query.patientGender = filters.patientGender;
    }

    if (filters.paymentStatus) {
      query.paymentStatus = filters.paymentStatus;
    }

    // Date range filters
    if (filters.startDate || filters.endDate) {
      query.preferredDate = {};
      if (filters.startDate) query.preferredDate.$gte = new Date(filters.startDate);
      if (filters.endDate) query.preferredDate.$lte = new Date(filters.endDate);
    }

    // Age range filters
    if (filters.minAge || filters.maxAge) {
      query.patientAge = {};
      if (filters.minAge) query.patientAge.$gte = parseInt(filters.minAge);
      if (filters.maxAge) query.patientAge.$lte = parseInt(filters.maxAge);
    }

    // Default options with population
    const searchOptions = {
      sort: searchQuery ? { score: { $meta: "textScore" } } : { bookingDate: -1 },
      populate: [
        { path: 'doctorId', select: 'fullName specialty consultationFees' },
        { path: 'clinicId', select: 'name address city phone' }
      ],
      ...options
    };

    return this.paginate(query, searchOptions);
  };

  // Get appointments by status
  getAppointmentsByStatus = (status, options = {}) => {
    const query = { status };
    const searchOptions = {
      populate: [
        { path: 'doctorId', select: 'fullName specialty consultationFees' },
        { path: 'clinicId', select: 'name address city phone' }
      ],
      sort: { preferredDate: 1 },
      ...options
    };
    return this.paginate(query, searchOptions);
  };

  // Get appointments by doctor
  getAppointmentsByDoctor = (doctorId, options = {}) => {
    const query = { doctorId };
    const searchOptions = {
      populate: [
        { path: 'doctorId', select: 'fullName specialty consultationFees' },
        { path: 'clinicId', select: 'name address city phone' }
      ],
      sort: { preferredDate: 1 },
      ...options
    };
    return this.paginate(query, searchOptions);
  };

  // Get appointments by clinic
  getAppointmentsByClinic = (clinicId, options = {}) => {
    const query = { clinicId };
    const searchOptions = {
      populate: [
        { path: 'doctorId', select: 'fullName specialty consultationFees' },
        { path: 'clinicId', select: 'name address city phone' }
      ],
      sort: { preferredDate: 1 },
      ...options
    };
    return this.paginate(query, searchOptions);
  };

  // Get appointments by patient email
  getAppointmentsByPatient = (patientEmail, options = {}) => {
    const query = { patientEmail };
    const searchOptions = {
      populate: [
        { path: 'doctorId', select: 'fullName specialty consultationFees' },
        { path: 'clinicId', select: 'name address city phone' }
      ],
      sort: { bookingDate: -1 },
      ...options
    };
    return this.paginate(query, searchOptions);
  };

  // Get appointments by date range
  getAppointmentsByDateRange = (startDate, endDate, options = {}) => {
    const query = {
      preferredDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
    const searchOptions = {
      populate: [
        { path: 'doctorId', select: 'fullName specialty consultationFees' },
        { path: 'clinicId', select: 'name address city phone' }
      ],
      sort: { preferredDate: 1 },
      ...options
    };
    return this.paginate(query, searchOptions);
  };

  // Update appointment status
  updateAppointmentStatus = (id, status, additionalData = {}) => {
    const updateData = { status, ...additionalData };
    
    // Add confirmation timestamp if confirming
    if (status === 'confirmed') {
      updateData.confirmedDate = new Date();
    }
    
    return this.findByIdAndUpdate(id, updateData);
  };

  // Confirm appointment with specific date and time
  confirmAppointment = (id, confirmedDate, confirmedTime, consultationFees = 0) => {
    return this.findByIdAndUpdate(id, {
      status: 'confirmed',
      confirmedDate: new Date(confirmedDate),
      confirmedTime,
      consultationFees,
      confirmedDate: new Date()
    });
  };

  // Cancel appointment with reason
  cancelAppointment = (id, cancellationReason) => {
    return this.findByIdAndUpdate(id, {
      status: 'cancelled',
      cancellationReason
    });
  };

  // Reschedule appointment
  rescheduleAppointment = (id, newDate, newTime) => {
    return this.findByIdAndUpdate(id, {
      status: 'rescheduled',
      preferredDate: new Date(newDate),
      preferredTime: newTime
    });
  };

  // Complete appointment with notes
  completeAppointment = (id, appointmentNotes = '') => {
    return this.findByIdAndUpdate(id, {
      status: 'completed',
      appointmentNotes
    });
  };

  // Update payment status
  updatePaymentStatus = (id, paymentStatus) => {
    return this.findByIdAndUpdate(id, { paymentStatus });
  };

  // Get pending appointments
  getPendingAppointments = (options = {}) => {
    return this.getAppointmentsByStatus('pending', options);
  };

  // Get today's appointments
  getTodaysAppointments = (options = {}) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.getAppointmentsByDateRange(today, tomorrow, options);
  };

  // Get upcoming appointments (next 7 days)
  getUpcomingAppointments = (options = {}) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return this.getAppointmentsByDateRange(today, nextWeek, options);
  };

  // Get appointment statistics
  getAppointmentStats = async () => {
    const stats = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalAppointments = await Appointment.countDocuments();
    const todayAppointments = await Appointment.countDocuments({
      preferredDate: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999)
      }
    });

    return {
      total: totalAppointments,
      today: todayAppointments,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    };
  };
}

module.exports.AppointmentService = new AppointmentService();
