const mongoose = require("mongoose");

const patientStorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 120
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  condition: {
    type: String,
    required: true,
    trim: true
  },
  treatment: {
    type: String,
    trim: true
  },
  surgery: {
    type: String,
    trim: true
  },
  doctor: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  date: {
    type: Date,
    default: Date.now
  },
  story: {
    type: String,
    required: true
  },
  outcome: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better search performance
patientStorySchema.index({ condition: 'text', story: 'text', outcome: 'text' });
patientStorySchema.index({ category: 1 });
patientStorySchema.index({ featured: 1 });
patientStorySchema.index({ status: 1 });
patientStorySchema.index({ rating: 1 });

module.exports = mongoose.model("PatientStory", patientStorySchema);
