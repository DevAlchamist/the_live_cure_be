const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['general', 'notifications', 'security', 'appearance'],
    unique: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Pre-save middleware to update lastUpdated
settingsSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model("Settings", settingsSchema);
