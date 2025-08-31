const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const workingHoursSchema = new mongoose.Schema({
  monday: {
    open: { type: String, default: "09:00" },
    close: { type: String, default: "17:00" },
    isClosed: { type: Boolean, default: false },
  },
  tuesday: {
    open: { type: String, default: "09:00" },
    close: { type: String, default: "17:00" },
    isClosed: { type: Boolean, default: false },
  },
  wednesday: {
    open: { type: String, default: "09:00" },
    close: { type: String, default: "17:00" },
    isClosed: { type: Boolean, default: false },
  },
  thursday: {
    open: { type: String, default: "09:00" },
    close: { type: String, default: "17:00" },
    isClosed: { type: Boolean, default: false },
  },
  friday: {
    open: { type: String, default: "09:00" },
    close: { type: String, default: "17:00" },
    isClosed: { type: Boolean, default: false },
  },
  saturday: {
    open: { type: String, default: "09:00" },
    close: { type: String, default: "17:00" },
    isClosed: { type: Boolean, default: false },
  },
  sunday: {
    open: { type: String, default: "09:00" },
    close: { type: String, default: "17:00" },
    isClosed: { type: Boolean, default: true },
  },
});

const clinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Primary Care", "Specialty Clinic", "Hospital", "Emergency Center", "Diagnostic Center"],
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    website: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    specialties: [{
      type: String,
      trim: true,
    }],
    facilities: [{
      type: String,
      trim: true,
    }],
    workingHours: {
      type: workingHoursSchema,
      default: () => ({}),
    },
    description: {
      type: String,
      default: "",
    },
    amenities: [{
      type: String,
      trim: true,
    }],
    emergencyContact: {
      type: String,
      trim: true,
    },
    isEmergencyCenter: {
      type: Boolean,
      default: false,
    },
    is24Hours: {
      type: Boolean,
      default: false,
    },
    hasParking: {
      type: Boolean,
      default: false,
    },
    hasWheelchairAccess: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
clinicSchema.index({
  name: "text",
  city: "text",
  state: "text",
  specialties: "text",
  type: "text",
});

// Add compound indexes for efficient filtering
clinicSchema.index({ city: 1, state: 1 });
clinicSchema.index({ type: 1, city: 1 });
clinicSchema.index({ status: 1 });
clinicSchema.index({ specialties: 1 });

clinicSchema.plugin(mongoosePaginate);

exports.Clinic = mongoose.model("Clinic", clinicSchema);
