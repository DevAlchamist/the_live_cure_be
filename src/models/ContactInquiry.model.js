const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const contactInquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['general', 'appointment', 'feedback'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'resolved', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  response: {
    type: String
  },
  respondedAt: {
    type: Date
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for better search performance
contactInquirySchema.index({ email: 1 });
contactInquirySchema.index({ type: 1 });
contactInquirySchema.index({ status: 1 });
contactInquirySchema.index({ priority: 1 });
contactInquirySchema.index({ createdAt: -1 });

// Add pagination plugin
contactInquirySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("ContactInquiry", contactInquirySchema);
