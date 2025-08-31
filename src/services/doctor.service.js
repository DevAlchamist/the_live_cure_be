const { Doctor } = require("../models/Doctor.model");
const BasicServices = require("./basic.service");

class DoctorService extends BasicServices {
  constructor() {
    super(Doctor);
  }

  // Advanced search with text search and filters
  searchDoctors = async (searchQuery, filters = {}, options = {}) => {
    const query = {};

    // Text search across multiple fields
    if (searchQuery) {
      query.$text = { $search: searchQuery };
    }

    // Apply filters
    if (filters.specialty) {
      query.specialty = new RegExp(filters.specialty, 'i');
    }

    if (filters.mainCategory) {
      query.mainCategory = new RegExp(filters.mainCategory, 'i');
    }

    if (filters.city) {
      query.cities = { $in: [new RegExp(filters.city, 'i')] };
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.isVisitingDoctor !== undefined) {
      query.isVisitingDoctor = filters.isVisitingDoctor;
    }

    if (filters.isHospitalDoctor !== undefined) {
      query.isHospitalDoctor = filters.isHospitalDoctor;
    }

    // Rating filter
    if (filters.minRating) {
      query.rating = { $gte: parseFloat(filters.minRating) };
    }

    // Consultation fees range
    if (filters.minFees || filters.maxFees) {
      query.consultationFees = {};
      if (filters.minFees) query.consultationFees.$gte = parseFloat(filters.minFees);
      if (filters.maxFees) query.consultationFees.$lte = parseFloat(filters.maxFees);
    }

    // Default options
    const searchOptions = {
      sort: searchQuery ? { score: { $meta: "textScore" } } : { createdAt: -1 },
      ...options
    };

    return this.paginate(query, searchOptions);
  };

  // Get doctors by specialty
  getDoctorsBySpecialty = (specialty, options = {}) => {
    const query = { 
      specialty: new RegExp(specialty, 'i'),
      status: 'active'
    };
    return this.paginate(query, options);
  };

  // Get doctors by city
  getDoctorsByCity = (city, options = {}) => {
    const query = { 
      cities: { $in: [new RegExp(city, 'i')] },
      status: 'active'
    };
    return this.paginate(query, options);
  };

  // Get doctors by main category
  getDoctorsByCategory = (category, options = {}) => {
    const query = { 
      mainCategory: new RegExp(category, 'i'),
      status: 'active'
    };
    return this.paginate(query, options);
  };

  // Update doctor status
  updateStatus = (id, status) => {
    return this.findByIdAndUpdate(id, { status });
  };

  // Get active doctors only
  getActiveDoctors = (options = {}) => {
    return this.paginate({ status: 'active' }, options);
  };

  // Add qualification to doctor
  addQualification = async (doctorId, qualification) => {
    const doctor = await this.findById(doctorId);
    if (!doctor) throw new Error('Doctor not found');
    
    doctor.qualifications.push(qualification);
    return doctor.save();
  };

  // Remove qualification from doctor
  removeQualification = async (doctorId, qualificationId) => {
    const doctor = await this.findById(doctorId);
    if (!doctor) throw new Error('Doctor not found');
    
    doctor.qualifications.id(qualificationId).remove();
    return doctor.save();
  };

  // Add city to doctor's practice locations
  addCity = async (doctorId, city) => {
    const doctor = await this.findById(doctorId);
    if (!doctor) throw new Error('Doctor not found');
    
    if (!doctor.cities.includes(city)) {
      doctor.cities.push(city);
      return doctor.save();
    }
    return doctor;
  };

  // Remove city from doctor's practice locations
  removeCity = async (doctorId, city) => {
    const doctor = await this.findById(doctorId);
    if (!doctor) throw new Error('Doctor not found');
    
    doctor.cities = doctor.cities.filter(c => c !== city);
    return doctor.save();
  };
}

module.exports.DoctorService = new DoctorService();
