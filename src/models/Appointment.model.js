const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const appointmentSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    patientMobile: {
      type: String,
      required: true,
      trim: true,
    },
    patientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    patientAge: {
      type: Number,
      required: true,
      min: 0,
      max: 150,
    },
    patientGender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other","male", "female", "other"],
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    treatmentType: {
      type: String,
      required: true,
      trim: true,
    },
    doctorName: {
      type: String,
      trim: true,
      default: "",
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      default: null,
    },
    preferredDate: {
      type: Date,
      required: true,
    },
    preferredTime: {
      type: String,
      required: true,
      trim: true,
    },
    symptoms: {
      type: String,
      default: "",
    },
    previousTreatment: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "rescheduled"],
      default: "pending",
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    appointmentNotes: {
      type: String,
      default: "",
    },
    cancellationReason: {
      type: String,
      default: "",
    },
    confirmedDate: {
      type: Date,
      default: null,
    },
    confirmedTime: {
      type: String,
      default: "",
    },
    consultationFees: {
      type: Number,
      min: 0,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
appointmentSchema.index({
  patientName: "text",
  patientEmail: "text",
  doctorName: "text",
  treatmentType: "text",
  city: "text",
});

// Add compound indexes for efficient filtering and queries
appointmentSchema.index({ status: 1, preferredDate: 1 });
appointmentSchema.index({ doctorId: 1, preferredDate: 1 });
appointmentSchema.index({ clinicId: 1, preferredDate: 1 });
appointmentSchema.index({ patientEmail: 1, bookingDate: -1 });
appointmentSchema.index({ city: 1, treatmentType: 1 });
appointmentSchema.index({ bookingDate: -1 });

appointmentSchema.plugin(mongoosePaginate);

exports.Appointment = mongoose.model("Appointment", appointmentSchema);
