const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const qualificationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true,
  },
  institute: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

const mapCoordinatesSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});

const doctorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    professionalTitle: {
      type: String,
      required: true,
      enum: ["Dr.", "Prof.", "Mr.", "Ms.", "Mrs."],
      default: "Dr.",
    },
    specialty: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    consultationFees: {
      type: Number,
      required: true,
      min: 0,
    },
    experience: {
      type: String,
      required: true,
      trim: true,
    },
    about: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: "",
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    qualifications: [qualificationSchema],
    mainCategory: {
      type: String,
      required: true,
      trim: true,
    },
    cities: [{
      type: String,
      trim: true,
    }],
    address: {
      type: String,
      required: true,
    },
    mapCoordinates: mapCoordinatesSchema,
    mapLink: {
      type: String,
      default: "",
    },
    diseasesTreated: [{
      type: String,
      trim: true,
    }],
    employeeCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isVisitingDoctor: {
      type: Boolean,
      default: false,
    },
    isHospitalDoctor: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
doctorSchema.index({
  fullName: "text",
  specialty: "text",
  mainCategory: "text",
  cities: "text",
  diseasesTreated: "text",
});

// Add compound indexes for efficient filtering
doctorSchema.index({ specialty: 1, cities: 1 });
doctorSchema.index({ mainCategory: 1, cities: 1 });
doctorSchema.index({ status: 1 });

doctorSchema.plugin(mongoosePaginate);

exports.Doctor = mongoose.model("Doctor", doctorSchema);
