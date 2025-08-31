const { Clinic } = require("../models/Clinic.model");
const BasicServices = require("./basic.service");

class ClinicService extends BasicServices {
  constructor() {
    super(Clinic);
  }

  // Advanced search with text search and filters
  searchClinics = async (searchQuery, filters = {}, options = {}) => {
    const query = {};

    // Text search across multiple fields
    if (searchQuery) {
      query.$text = { $search: searchQuery };
    }

    // Apply filters
    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.city) {
      query.city = new RegExp(filters.city, 'i');
    }

    if (filters.state) {
      query.state = new RegExp(filters.state, 'i');
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.specialty) {
      query.specialties = { $in: [new RegExp(filters.specialty, 'i')] };
    }

    if (filters.isEmergencyCenter !== undefined) {
      query.isEmergencyCenter = filters.isEmergencyCenter;
    }

    if (filters.is24Hours !== undefined) {
      query.is24Hours = filters.is24Hours;
    }

    if (filters.hasParking !== undefined) {
      query.hasParking = filters.hasParking;
    }

    if (filters.hasWheelchairAccess !== undefined) {
      query.hasWheelchairAccess = filters.hasWheelchairAccess;
    }

    // Default options
    const searchOptions = {
      sort: searchQuery ? { score: { $meta: "textScore" } } : { createdAt: -1 },
      ...options
    };

    return this.paginate(query, searchOptions);
  };

  // Get clinics by city
  getClinicsByCity = (city, options = {}) => {
    const query = { 
      city: new RegExp(city, 'i'),
      status: 'active'
    };
    return this.paginate(query, options);
  };

  // Get clinics by type
  getClinicsByType = (type, options = {}) => {
    const query = { 
      type: type,
      status: 'active'
    };
    return this.paginate(query, options);
  };

  // Get clinics by specialty
  getClinicsBySpecialty = (specialty, options = {}) => {
    const query = { 
      specialties: { $in: [new RegExp(specialty, 'i')] },
      status: 'active'
    };
    return this.paginate(query, options);
  };

  // Get emergency centers
  getEmergencyCenters = (options = {}) => {
    const query = { 
      isEmergencyCenter: true,
      status: 'active'
    };
    return this.paginate(query, options);
  };

  // Get 24-hour clinics
  get24HourClinics = (options = {}) => {
    const query = { 
      is24Hours: true,
      status: 'active'
    };
    return this.paginate(query, options);
  };

  // Update clinic status
  updateStatus = (id, status) => {
    return this.findByIdAndUpdate(id, { status });
  };

  // Get active clinics only
  getActiveClinics = (options = {}) => {
    return this.paginate({ status: 'active' }, options);
  };

  // Add specialty to clinic
  addSpecialty = async (clinicId, specialty) => {
    const clinic = await this.findById(clinicId);
    if (!clinic) throw new Error('Clinic not found');
    
    if (!clinic.specialties.includes(specialty)) {
      clinic.specialties.push(specialty);
      return clinic.save();
    }
    return clinic;
  };

  // Remove specialty from clinic
  removeSpecialty = async (clinicId, specialty) => {
    const clinic = await this.findById(clinicId);
    if (!clinic) throw new Error('Clinic not found');
    
    clinic.specialties = clinic.specialties.filter(s => s !== specialty);
    return clinic.save();
  };

  // Add facility to clinic
  addFacility = async (clinicId, facility) => {
    const clinic = await this.findById(clinicId);
    if (!clinic) throw new Error('Clinic not found');
    
    if (!clinic.facilities.includes(facility)) {
      clinic.facilities.push(facility);
      return clinic.save();
    }
    return clinic;
  };

  // Remove facility from clinic
  removeFacility = async (clinicId, facility) => {
    const clinic = await this.findById(clinicId);
    if (!clinic) throw new Error('Clinic not found');
    
    clinic.facilities = clinic.facilities.filter(f => f !== facility);
    return clinic.save();
  };

  // Update working hours
  updateWorkingHours = (clinicId, workingHours) => {
    return this.findByIdAndUpdate(clinicId, { workingHours });
  };

  // Get clinics with specific amenities
  getClinicsByAmenities = (amenities, options = {}) => {
    const query = {
      amenities: { $in: amenities },
      status: 'active'
    };
    return this.paginate(query, options);
  };
}

module.exports.ClinicService = new ClinicService();
