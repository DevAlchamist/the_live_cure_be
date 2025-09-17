const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'appointment', 'reminder', 'system'],
    default: 'info'
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  dismissed: {
    type: Boolean,
    default: false
  },
  dismissedAt: {
    type: Date,
    default: null
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
notificationSchema.index({ recipientId: 1, read: 1 });
notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ status: 1 });

module.exports = {
  NotificationModel: mongoose.model("Notification", notificationSchema)
};
