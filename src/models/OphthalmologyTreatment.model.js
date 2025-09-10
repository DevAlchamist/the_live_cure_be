const mongoose = require("mongoose");

const ophthalmologyTreatmentSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: [{
    type: String
  }],
  overview: [{
    heading: {
      type: String,
      required: true
    },
    items: [{
      type: String
    }]
  }],
  diagnosis: {
    heading: {
      type: String,
      required: true
    },
    content: [{
      type: String
    }]
  },
  treatment_section: {
    heading: {
      type: String,
      required: true
    },
    intro: {
      type: String,
      required: true
    },
    treatments: [{
      title: String,
      description: String
    }],
    outro: {
      type: String,
      required: true
    }
  },
  whyChooseUs: [{
    number: {
      type: String,
      required: true
    },
    heading: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],
  faq: [{
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Index for better search performance
ophthalmologyTreatmentSchema.index({ title: 'text', description: 'text' });
ophthalmologyTreatmentSchema.index({ url: 1 });
ophthalmologyTreatmentSchema.index({ status: 1 });

module.exports = mongoose.model("OphthalmologyTreatment", ophthalmologyTreatmentSchema);
