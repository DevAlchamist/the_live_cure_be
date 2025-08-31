const HttpError = require("../helpers/HttpError.helpers");
const Response = require("../helpers/Response.helpers");
const { ClinicService } = require("../services/clinic.service");
const createQueryHelper = require("../helpers/Query.helper");

class ClinicController {
  // Create new clinic
  createClinic = async (req, res) => {
    const clinic = await ClinicService.create(req.body);
    
    Response(res)
      .status(201)
      .message("Clinic created successfully")
      .body(clinic)
      .send();
  };

  // Get all clinics with search and filters
  getAllClinics = async (req, res) => {
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: ["name", "city", "state"],
      unFilter: [],
      customFilters: (filter, query) => {
        // Add custom filters from query params
        if (query.type) filter.type = query.type;
        if (query.city) filter.city = query.city;
        if (query.state) filter.state = query.state;
        if (query.status) filter.status = query.status;
        if (query.specialty) filter.specialty = query.specialty;
        if (query.isEmergencyCenter !== undefined) filter.isEmergencyCenter = query.isEmergencyCenter === 'true';
        if (query.is24Hours !== undefined) filter.is24Hours = query.is24Hours === 'true';
        if (query.hasParking !== undefined) filter.hasParking = query.hasParking === 'true';
        if (query.hasWheelchairAccess !== undefined) filter.hasWheelchairAccess = query.hasWheelchairAccess === 'true';
      },
    });

    const clinics = await ClinicService.searchClinics(req.query.search, filter, options);
    Response(res).body(clinics).send();
  };

  // Get clinic by ID
  getClinicById = async (req, res) => {
    const { clinicId } = req.params;
    const clinic = await ClinicService.findById(clinicId);
    
    if (!clinic) {
      throw new HttpError(404, "Clinic not found");
    }

    Response(res).body(clinic).send();
  };

  // Update clinic
  updateClinic = async (req, res) => {
    const { clinicId } = req.params;
    const clinic = await ClinicService.findByIdAndUpdate(clinicId, req.body);
    
    if (!clinic) {
      throw new HttpError(404, "Clinic not found");
    }

    Response(res)
      .status(200)
      .message("Clinic updated successfully")
      .body(clinic)
      .send();
  };

  // Delete clinic
  deleteClinic = async (req, res) => {
    const { clinicId } = req.params;
    const clinic = await ClinicService.findByIdAndDelete(clinicId);
    
    if (!clinic) {
      throw new HttpError(404, "Clinic not found");
    }

    Response(res)
      .status(200)
      .message("Clinic deleted successfully")
      .send();
  };

  // Get clinics by city
  getClinicsByCity = async (req, res) => {
    const { city } = req.params;
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: [],
      unFilter: [],
    });

    const clinics = await ClinicService.getClinicsByCity(city, options);
    Response(res).body(clinics).send();
  };

  // Get clinics by type
  getClinicsByType = async (req, res) => {
    const { type } = req.params;
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: [],
      unFilter: [],
    });

    const clinics = await ClinicService.getClinicsByType(type, options);
    Response(res).body(clinics).send();
  };

  // Get clinics by specialty
  getClinicsBySpecialty = async (req, res) => {
    const { specialty } = req.params;
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: [],
      unFilter: [],
    });

    const clinics = await ClinicService.getClinicsBySpecialty(specialty, options);
    Response(res).body(clinics).send();
  };

  // Get emergency centers
  getEmergencyCenters = async (req, res) => {
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: [],
      unFilter: [],
    });

    const clinics = await ClinicService.getEmergencyCenters(options);
    Response(res).body(clinics).send();
  };

  // Get 24-hour clinics
  get24HourClinics = async (req, res) => {
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: [],
      unFilter: [],
    });

    const clinics = await ClinicService.get24HourClinics(options);
    Response(res).body(clinics).send();
  };

  // Update clinic status
  updateClinicStatus = async (req, res) => {
    const { clinicId } = req.params;
    const { status } = req.body;
    
    if (!["active", "inactive"].includes(status)) {
      throw new HttpError(400, "Invalid status. Must be 'active' or 'inactive'");
    }

    const clinic = await ClinicService.updateStatus(clinicId, status);
    
    if (!clinic) {
      throw new HttpError(404, "Clinic not found");
    }

    Response(res)
      .status(200)
      .message(`Clinic status updated to ${status}`)
      .body(clinic)
      .send();
  };

  // Add specialty to clinic
  addSpecialty = async (req, res) => {
    const { clinicId } = req.params;
    const { specialty } = req.body;

    try {
      const clinic = await ClinicService.addSpecialty(clinicId, specialty);
      Response(res)
        .status(200)
        .message("Specialty added successfully")
        .body(clinic)
        .send();
    } catch (error) {
      throw new HttpError(404, error.message);
    }
  };

  // Remove specialty from clinic
  removeSpecialty = async (req, res) => {
    const { clinicId } = req.params;
    const { specialty } = req.body;

    try {
      const clinic = await ClinicService.removeSpecialty(clinicId, specialty);
      Response(res)
        .status(200)
        .message("Specialty removed successfully")
        .body(clinic)
        .send();
    } catch (error) {
      throw new HttpError(404, error.message);
    }
  };

  // Add facility to clinic
  addFacility = async (req, res) => {
    const { clinicId } = req.params;
    const { facility } = req.body;

    try {
      const clinic = await ClinicService.addFacility(clinicId, facility);
      Response(res)
        .status(200)
        .message("Facility added successfully")
        .body(clinic)
        .send();
    } catch (error) {
      throw new HttpError(404, error.message);
    }
  };

  // Remove facility from clinic
  removeFacility = async (req, res) => {
    const { clinicId } = req.params;
    const { facility } = req.body;

    try {
      const clinic = await ClinicService.removeFacility(clinicId, facility);
      Response(res)
        .status(200)
        .message("Facility removed successfully")
        .body(clinic)
        .send();
    } catch (error) {
      throw new HttpError(404, error.message);
    }
  };

  // Update working hours
  updateWorkingHours = async (req, res) => {
    const { clinicId } = req.params;
    const { workingHours } = req.body;

    const clinic = await ClinicService.updateWorkingHours(clinicId, workingHours);
    
    if (!clinic) {
      throw new HttpError(404, "Clinic not found");
    }

    Response(res)
      .status(200)
      .message("Working hours updated successfully")
      .body(clinic)
      .send();
  };

  // Get active clinics only
  getActiveClinics = async (req, res) => {
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: ["name", "city"],
      unFilter: [],
    });

    const clinics = await ClinicService.getActiveClinics(options);
    Response(res).body(clinics).send();
  };

  // Get clinics by amenities
  getClinicsByAmenities = async (req, res) => {
    const { amenities } = req.body; // Array of amenities
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: [],
      unFilter: [],
    });

    if (!Array.isArray(amenities)) {
      throw new HttpError(400, "Amenities must be an array");
    }

    const clinics = await ClinicService.getClinicsByAmenities(amenities, options);
    Response(res).body(clinics).send();
  };
}

module.exports.ClinicController = new ClinicController();
