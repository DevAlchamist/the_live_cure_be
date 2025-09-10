const ContactInquiry = require("../models/ContactInquiry.model");
const createQueryHelper = require("../helpers/Query.helper");

class ContactInquiryService {
  // Create new contact inquiry
  create = async (data) => {
    const inquiry = new ContactInquiry(data);
    return await inquiry.save();
  };

  // Get all inquiries with pagination and filters
  paginate = async (filter, options) => {
    return await ContactInquiry.paginate(filter, options);
  };

  // Find inquiry by ID
  findById = async (id) => {
    return await ContactInquiry.findById(id).populate('assignedTo respondedBy', 'name email');
  };

  // Update inquiry
  findByIdAndUpdate = async (id, data) => {
    return await ContactInquiry.findByIdAndUpdate(id, data, { new: true });
  };

  // Delete inquiry
  findByIdAndDelete = async (id) => {
    return await ContactInquiry.findByIdAndDelete(id);
  };

  // Get inquiries by status
  getByStatus = async (status, options = {}) => {
    const { page = 1, limit = 10 } = options;
    return await ContactInquiry.paginate(
      { status },
      { 
        page, 
        limit, 
        sort: { createdAt: -1 },
        populate: 'assignedTo respondedBy'
      }
    );
  };

  // Get inquiries by type
  getByType = async (type, options = {}) => {
    const { page = 1, limit = 10 } = options;
    return await ContactInquiry.paginate(
      { type },
      { 
        page, 
        limit, 
        sort: { createdAt: -1 },
        populate: 'assignedTo respondedBy'
      }
    );
  };

  // Get inquiries by priority
  getByPriority = async (priority, options = {}) => {
    const { page = 1, limit = 10 } = options;
    return await ContactInquiry.paginate(
      { priority },
      { 
        page, 
        limit, 
        sort: { createdAt: -1 },
        populate: 'assignedTo respondedBy'
      }
    );
  };

  // Get new inquiries
  getNewInquiries = async (options = {}) => {
    return await this.getByStatus('new', options);
  };

  // Get urgent inquiries
  getUrgentInquiries = async (options = {}) => {
    return await this.getByPriority('urgent', options);
  };

  // Assign inquiry to user
  assignInquiry = async (id, assignedTo) => {
    return await ContactInquiry.findByIdAndUpdate(
      id,
      { assignedTo },
      { new: true }
    );
  };

  // Respond to inquiry
  respondToInquiry = async (id, response, respondedBy) => {
    return await ContactInquiry.findByIdAndUpdate(
      id,
      { 
        response,
        respondedAt: new Date(),
        respondedBy,
        status: 'resolved'
      },
      { new: true }
    );
  };

  // Update inquiry status
  updateStatus = async (id, status) => {
    return await ContactInquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
  };

  // Get inquiry statistics
  getStatistics = async () => {
    const stats = await ContactInquiry.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
          urgent: { $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] } },
          high: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
          low: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } }
        }
      }
    ]);

    return stats[0] || {
      total: 0,
      new: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0,
      urgent: 0,
      high: 0,
      medium: 0,
      low: 0
    };
  };

  // Get recent inquiries
  getRecentInquiries = async (limit = 10) => {
    return await ContactInquiry.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('assignedTo respondedBy', 'name email')
      .select('name email subject type status priority createdAt');
  };
}

module.exports = { ContactInquiryService: new ContactInquiryService() };
