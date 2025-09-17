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

  // Get clinic statistics
  getClinicStats = async () => {
    // Total clinics count
    const totalClinics = await Clinic.countDocuments();
    
    // Active vs Inactive clinics
    const statusStats = await Clinic.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Clinics by type
    const typeStats = await Clinic.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Clinics by city (top 10)
    const cityStats = await Clinic.aggregate([
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Clinics by state
    const stateStats = await Clinic.aggregate([
      {
        $group: {
          _id: '$state',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Special features statistics
    const emergencyCenters = await Clinic.countDocuments({ isEmergencyCenter: true });
    const twentyFourHourClinics = await Clinic.countDocuments({ is24Hours: true });
    const clinicsWithParking = await Clinic.countDocuments({ hasParking: true });
    const wheelchairAccessible = await Clinic.countDocuments({ hasWheelchairAccess: true });

    // Most common specialties (top 10)
    const specialtyStats = await Clinic.aggregate([
      { $unwind: '$specialties' },
      {
        $group: {
          _id: '$specialties',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Most common facilities (top 10)
    const facilityStats = await Clinic.aggregate([
      { $unwind: '$facilities' },
      {
        $group: {
          _id: '$facilities',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Recently added clinics (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentClinics = await Clinic.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    return {
      totalClinics,
      statusBreakdown: statusStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      typeBreakdown: typeStats,
      topCities: cityStats,
      stateBreakdown: stateStats,
      features: {
        emergencyCenters,
        twentyFourHourClinics,
        clinicsWithParking,
        wheelchairAccessible
      },
      topSpecialties: specialtyStats,
      topFacilities: facilityStats,
      recentlyAdded: recentClinics,
      lastUpdated: new Date()
    };
  };
}

module.exports.ClinicService = new ClinicService();
