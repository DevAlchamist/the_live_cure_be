const HttpError = require("../helpers/HttpError.helpers");
const Response = require("../helpers/Response.helpers");
const { ContactInquiryService } = require("../services/contactInquiry.service");
const createQueryHelper = require("../helpers/Query.helper");

class ContactInquiryController {
  // Create new contact inquiry
  createInquiry = async (req, res) => {
    const inquiry = await ContactInquiryService.create(req.body);
    
    Response(res)
      .status(201)
      .message("Contact inquiry submitted successfully")
      .body(inquiry)
      .send();
  };

  // Get all inquiries
  getAllInquiries = async (req, res) => {
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: ["name", "email", "subject", "message"],
      unFilter: [],
      customFilters: (filter, query) => {
        if (query.type) filter.type = query.type;
        if (query.status) filter.status = query.status;
        if (query.priority) filter.priority = query.priority;
        if (query.assignedTo) filter.assignedTo = query.assignedTo;
      },
      customPopulate: [
        { path: 'assignedTo', select: 'name email' },
        { path: 'respondedBy', select: 'name email' }
      ]
    }, {}); // Pass empty object as defaultFilter - ContactInquiry doesn't have deactivated field

    const inquiries = await ContactInquiryService.paginate(filter, options);
    Response(res).body(inquiries).send();
  };

  // Get inquiry by ID
  getInquiryById = async (req, res) => {
    const { id } = req.params;
    const inquiry = await ContactInquiryService.findById(id);
    
    if (!inquiry) {
      throw new HttpError(404, "Contact inquiry not found");
    }

    Response(res).body(inquiry).send();
  };

  // Update inquiry
  updateInquiry = async (req, res) => {
    const { id } = req.params;
    const inquiry = await ContactInquiryService.findByIdAndUpdate(id, req.body);
    
    if (!inquiry) {
      throw new HttpError(404, "Contact inquiry not found");
    }

    Response(res)
      .status(200)
      .message("Contact inquiry updated successfully")
      .body(inquiry)
      .send();
  };

  // Delete inquiry
  deleteInquiry = async (req, res) => {
    const { id } = req.params;
    const inquiry = await ContactInquiryService.findByIdAndDelete(id);
    
    if (!inquiry) {
      throw new HttpError(404, "Contact inquiry not found");
    }

    Response(res)
      .status(200)
      .message("Contact inquiry deleted successfully")
      .send();
  };

  // Get inquiries by status
  getInquiriesByStatus = async (req, res) => {
    const { status } = req.params;
    const { page = 1, limit } = req.query;
    const inquiries = await ContactInquiryService.getByStatus(status, { page, limit });
    Response(res).body(inquiries).send();
  };

  // Get inquiries by type
  getInquiriesByType = async (req, res) => {
    const { type } = req.params;
    const { page = 1, limit } = req.query;
    const inquiries = await ContactInquiryService.getByType(type, { page, limit });
    Response(res).body(inquiries).send();
  };

  // Get new inquiries
  getNewInquiries = async (req, res) => {
    const { page = 1, limit } = req.query;
    const inquiries = await ContactInquiryService.getNewInquiries({ page, limit });
    Response(res).body(inquiries).send();
  };

  // Get urgent inquiries
  getUrgentInquiries = async (req, res) => {
    const { page = 1, limit } = req.query;
    const inquiries = await ContactInquiryService.getUrgentInquiries({ page, limit });
    Response(res).body(inquiries).send();
  };

  // Assign inquiry to user
  assignInquiry = async (req, res) => {
    const { id } = req.params;
    const { assignedTo } = req.body;
    
    const inquiry = await ContactInquiryService.assignInquiry(id, assignedTo);
    
    if (!inquiry) {
      throw new HttpError(404, "Contact inquiry not found");
    }

    Response(res)
      .status(200)
      .message("Inquiry assigned successfully")
      .body(inquiry)
      .send();
  };

  // Respond to inquiry
  respondToInquiry = async (req, res) => {
    const { id } = req.params;
    const { response } = req.body;
    
    // Handle case when auth is disabled - req.user might be undefined
    const respondedBy = req.user?._id || null;
    const inquiry = await ContactInquiryService.respondToInquiry(id, response, respondedBy);
    
    if (!inquiry) {
      throw new HttpError(404, "Contact inquiry not found");
    }

    Response(res)
      .status(200)
      .message("Response sent successfully")
      .body(inquiry)
      .send();
  };

  // Update inquiry status
  updateInquiryStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['new', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      throw new HttpError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    
    const inquiry = await ContactInquiryService.updateStatus(id, status);
    
    if (!inquiry) {
      throw new HttpError(404, "Contact inquiry not found");
    }

    Response(res)
      .status(200)
      .message("Inquiry status updated successfully")
      .body(inquiry)
      .send();
  };

  // Get inquiry statistics
  getInquiryStatistics = async (req, res) => {
    const stats = await ContactInquiryService.getStatistics();
    Response(res).body(stats).send();
  };

  // Get recent inquiries
  getRecentInquiries = async (req, res) => {
    const { limit } = req.query;
    const inquiries = await ContactInquiryService.getRecentInquiries(parseInt(limit));
    Response(res).body(inquiries).send();
  };

  // Submit appointment request
  submitAppointmentRequest = async (req, res) => {
    const appointmentData = {
      ...req.body,
      type: 'appointment',
      priority: 'high'
    };
    
    const inquiry = await ContactInquiryService.create(appointmentData);
    
    Response(res)
      .status(201)
      .message("Appointment request submitted successfully")
      .body(inquiry)
      .send();
  };
}

module.exports = { ContactInquiryController: new ContactInquiryController() };
