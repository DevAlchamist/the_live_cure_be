const HttpError = require("../helpers/HttpError.helpers");
const Response = require("../helpers/Response.helpers");
const { AppointmentService } = require("../services/appointment.service");
const createQueryHelper = require("../helpers/Query.helper");

class AppointmentController {
  // Create new appointment
  createAppointment = async (req, res) => {
    // Validate required fields
    const requiredFields = ['patientName', 'patientMobile', 'patientEmail', 'patientAge', 'patientGender', 'city', 'treatmentType', 'preferredDate', 'preferredTime'];
    
    for (const field of requiredFields) {
      if (!req.body[field]) {
        throw new HttpError(400, `${field} is required`);
      }
    }

    const appointment = await AppointmentService.createAppointment(req.body);
    
    Response(res)
      .status(201)
      .message("Appointment booked successfully")
      .body(appointment)
      .send();
  };

  // Get all appointments with search and filters
  getAllAppointments = async (req, res) => {
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: ["patientName", "patientEmail", "doctorName", "treatmentType"],
      unFilter: [],
      customFilters: (filter, query) => {
        // Add custom filters from query params
        if (query.status) filter.status = query.status;
        if (query.doctorId) filter.doctorId = query.doctorId;
        if (query.clinicId) filter.clinicId = query.clinicId;
        if (query.city) filter.city = query.city;
        if (query.treatmentType) filter.treatmentType = query.treatmentType;
        if (query.patientGender) filter.patientGender = query.patientGender;
        if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
        if (query.startDate) filter.startDate = query.startDate;
        if (query.endDate) filter.endDate = query.endDate;
        if (query.minAge) filter.minAge = query.minAge;
        if (query.maxAge) filter.maxAge = query.maxAge;
      },
    });

    const appointments = await AppointmentService.searchAppointments(req.query.search, filter, options);
    Response(res).body(appointments).send();
  };

  // Get appointment by ID
  getAppointmentById = async (req, res) => {
    const { appointmentId } = req.params;
    const appointment = await AppointmentService.findById(appointmentId);
    
    if (!appointment) {
      throw new HttpError(404, "Appointment not found");
    }

    // Populate related data
    await appointment.populate([
      { path: 'doctorId', select: 'fullName specialty consultationFees contactNumber' },
      { path: 'clinicId', select: 'name address city phone email' }
    ]);

    Response(res).body(appointment).send();
  };

  // Update appointment
  updateAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const appointment = await AppointmentService.findByIdAndUpdate(appointmentId, req.body);
    
    if (!appointment) {
      throw new HttpError(404, "Appointment not found");
    }

    Response(res)
      .status(200)
      .message("Appointment updated successfully")
      .body(appointment)
      .send();
  };

  // Delete appointment
  deleteAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const appointment = await AppointmentService.findByIdAndDelete(appointmentId);
    
    if (!appointment) {
      throw new HttpError(404, "Appointment not found");
    }

    Response(res)
      .status(200)
      .message("Appointment deleted successfully")
      .send();
  };

  // Get appointments by status
  getAppointmentsByStatus = async (req, res) => {
    const { status } = req.params;
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: [],
      unFilter: [],
    });

    const appointments = await AppointmentService.getAppointmentsByStatus(status, options);
    Response(res).body(appointments).send();
  };

  // Get appointments by doctor
  getAppointmentsByDoctor = async (req, res) => {
    const { doctorId } = req.params;
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: [],
      unFilter: [],
    });

    const appointments = await AppointmentService.getAppointmentsByDoctor(doctorId, options);
    Response(res).body(appointments).send();
  };

  // Get appointments by clinic
  getAppointmentsByClinic = async (req, res) => {
    const { clinicId } = req.params;
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: [],
      unFilter: [],
    });

    const appointments = await AppointmentService.getAppointmentsByClinic(clinicId, options);
    Response(res).body(appointments).send();
  };

  // Get appointments by patient
  getAppointmentsByPatient = async (req, res) => {
    const { patientEmail } = req.params;
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: [],
      unFilter: [],
    });

    const appointments = await AppointmentService.getAppointmentsByPatient(patientEmail, options);
    Response(res).body(appointments).send();
  };

  // Get appointments by date range
  getAppointmentsByDateRange = async (req, res) => {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      throw new HttpError(400, "Both startDate and endDate are required");
    }

    const { filter, options } = createQueryHelper(req.query, {
      searchFields: [],
      unFilter: [],
    });

    const appointments = await AppointmentService.getAppointmentsByDateRange(startDate, endDate, options);
    Response(res).body(appointments).send();
  };

  // Update appointment status
  updateAppointmentStatus = async (req, res) => {
    const { appointmentId } = req.params;
    const { status, ...additionalData } = req.body;
    
    const validStatuses = ["pending", "confirmed", "cancelled", "completed", "rescheduled"];
    if (!validStatuses.includes(status)) {
      throw new HttpError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const appointment = await AppointmentService.updateAppointmentStatus(appointmentId, status, additionalData);
    
    if (!appointment) {
      throw new HttpError(404, "Appointment not found");
    }

    Response(res)
      .status(200)
      .message(`Appointment status updated to ${status}`)
      .body(appointment)
      .send();
  };

  // Confirm appointment
  confirmAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const { confirmedDate, confirmedTime, consultationFees } = req.body;
    
    if (!confirmedDate || !confirmedTime) {
      throw new HttpError(400, "Both confirmedDate and confirmedTime are required");
    }

    const appointment = await AppointmentService.confirmAppointment(appointmentId, confirmedDate, confirmedTime, consultationFees);
    
    if (!appointment) {
      throw new HttpError(404, "Appointment not found");
    }

    Response(res)
      .status(200)
      .message("Appointment confirmed successfully")
      .body(appointment)
      .send();
  };

  // Cancel appointment
  cancelAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const { cancellationReason } = req.body;
    
    if (!cancellationReason) {
      throw new HttpError(400, "Cancellation reason is required");
    }

    const appointment = await AppointmentService.cancelAppointment(appointmentId, cancellationReason);
    
    if (!appointment) {
      throw new HttpError(404, "Appointment not found");
    }

    Response(res)
      .status(200)
      .message("Appointment cancelled successfully")
      .body(appointment)
      .send();
  };

  // Reschedule appointment
  rescheduleAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const { newDate, newTime } = req.body;
    
    if (!newDate || !newTime) {
      throw new HttpError(400, "Both newDate and newTime are required");
    }

    const appointment = await AppointmentService.rescheduleAppointment(appointmentId, newDate, newTime);
    
    if (!appointment) {
      throw new HttpError(404, "Appointment not found");
    }

    Response(res)
      .status(200)
      .message("Appointment rescheduled successfully")
      .body(appointment)
      .send();
  };

  // Complete appointment
  completeAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const { appointmentNotes } = req.body;

    const appointment = await AppointmentService.completeAppointment(appointmentId, appointmentNotes);
    
    if (!appointment) {
      throw new HttpError(404, "Appointment not found");
    }

    Response(res)
      .status(200)
      .message("Appointment completed successfully")
      .body(appointment)
      .send();
  };

  // Update payment status
  updatePaymentStatus = async (req, res) => {
    const { appointmentId } = req.params;
    const { paymentStatus } = req.body;
    
    const validPaymentStatuses = ["pending", "paid", "failed", "refunded"];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      throw new HttpError(400, `Invalid payment status. Must be one of: ${validPaymentStatuses.join(', ')}`);
    }

    const appointment = await AppointmentService.updatePaymentStatus(appointmentId, paymentStatus);
    
    if (!appointment) {
      throw new HttpError(404, "Appointment not found");
    }

    Response(res)
      .status(200)
      .message("Payment status updated successfully")
      .body(appointment)
      .send();
  };

  // Get pending appointments
  getPendingAppointments = async (req, res) => {
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: [],
      unFilter: [],
    });

    const appointments = await AppointmentService.getPendingAppointments(options);
    Response(res).body(appointments).send();
  };

  // Get today's appointments
  getTodaysAppointments = async (req, res) => {
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: [],
      unFilter: [],
    });

    const appointments = await AppointmentService.getTodaysAppointments(options);
    Response(res).body(appointments).send();
  };

  // Get upcoming appointments
  getUpcomingAppointments = async (req, res) => {
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: [],
      unFilter: [],
    });

    const appointments = await AppointmentService.getUpcomingAppointments(options);
    Response(res).body(appointments).send();
  };

  // Get appointment statistics
  getAppointmentStats = async (req, res) => {
    const stats = await AppointmentService.getAppointmentStats();
    Response(res).body(stats).send();
  };
}

module.exports.AppointmentController = new AppointmentController();
