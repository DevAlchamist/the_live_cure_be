const HttpError = require("../helpers/HttpError.helpers");
const Response = require("../helpers/Response.helpers");
const { DoctorService } = require("../services/doctor.service");
const createQueryHelper = require("../helpers/Query.helper");

class DoctorController {
  // Create new doctor
  createDoctor = async (req, res) => {
    const doctor = await DoctorService.create(req.body);
    
    Response(res)
      .status(201)
      .message("Doctor created successfully")
      .body(doctor)
      .send();
  };

  // Get all doctors with search and filters
  getAllDoctors = async (req, res) => {
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: ["fullName", "specialty", "mainCategory", "cities", "diseasesTreated"],
      customLabels: { docs: "doctors" },
      customPopulate: [],
    });

    // Remove the default 'deactivated' filter since Doctor model uses 'status' field
    delete filter.deactivated;

    const doctors = await DoctorService.paginate(filter, options);
    Response(res).body(...doctors).send();
  };

  // Get doctor by ID
  getDoctorById = async (req, res) => {
    const { doctorId } = req.params;
    const doctor = await DoctorService.findById(doctorId);
    
    if (!doctor) {
      throw new HttpError(404, "Doctor not found");
    }

    Response(res).body(doctor).send();
  };

  // Update doctor
  updateDoctor = async (req, res) => {
    const { doctorId } = req.params;
    const doctor = await DoctorService.findByIdAndUpdate(doctorId, req.body);
    
    if (!doctor) {
      throw new HttpError(404, "Doctor not found");
    }

    Response(res)
      .status(200)
      .message("Doctor updated successfully")
      .body(doctor)
      .send();
  };

  // Delete doctor
  deleteDoctor = async (req, res) => {
    const { doctorId } = req.params;
    const doctor = await DoctorService.findByIdAndDelete(doctorId);
    
    if (!doctor) {
      throw new HttpError(404, "Doctor not found");
    }

    Response(res)
      .status(200)
      .message("Doctor deleted successfully")
      .send();
  };

  // Get doctors by specialty
  getDoctorsBySpecialty = async (req, res) => {
    const { specialty } = req.params;
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: [],
      unFilter: [],
    });

    const doctors = await DoctorService.getDoctorsBySpecialty(specialty, options);
    Response(res).body(...doctors).send();
  };

  // Get doctors by city
  getDoctorsByCity = async (req, res) => {
    const { city } = req.params;
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: [],
      unFilter: [],
    });

    const doctors = await DoctorService.getDoctorsByCity(city, options);
    Response(res).body(...doctors).send();
  };

  // Get doctors by category
  getDoctorsByCategory = async (req, res) => {
    const { category } = req.params;
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: [],
      unFilter: [],
    });

    const doctors = await DoctorService.getDoctorsByCategory(category, options);
    Response(res).body(...doctors).send();
  };

  // Update doctor status
  updateDoctorStatus = async (req, res) => {
    const { doctorId } = req.params;
    const { status } = req.body;
    
    if (!["active", "inactive"].includes(status)) {
      throw new HttpError(400, "Invalid status. Must be 'active' or 'inactive'");
    }

    const doctor = await DoctorService.updateStatus(doctorId, status);
    
    if (!doctor) {
      throw new HttpError(404, "Doctor not found");
    }

    Response(res)
      .status(200)
      .message(`Doctor status updated to ${status}`)
      .body(doctor)
      .send();
  };

  // Add qualification to doctor
  addQualification = async (req, res) => {
    const { doctorId } = req.params;
    const qualification = req.body;

    try {
      const doctor = await DoctorService.addQualification(doctorId, qualification);
      Response(res)
        .status(200)
        .message("Qualification added successfully")
        .body(doctor)
        .send();
    } catch (error) {
      throw new HttpError(404, error.message);
    }
  };

  // Remove qualification from doctor
  removeQualification = async (req, res) => {
    const { doctorId, qualificationId } = req.params;

    try {
      const doctor = await DoctorService.removeQualification(doctorId, qualificationId);
      Response(res)
        .status(200)
        .message("Qualification removed successfully")
        .body(doctor)
        .send();
    } catch (error) {
      throw new HttpError(404, error.message);
    }
  };

  // Add city to doctor
  addCity = async (req, res) => {
    const { doctorId } = req.params;
    const { city } = req.body;

    try {
      const doctor = await DoctorService.addCity(doctorId, city);
      Response(res)
        .status(200)
        .message("City added successfully")
        .body(doctor)
        .send();
    } catch (error) {
      throw new HttpError(404, error.message);
    }
  };

  // Remove city from doctor
  removeCity = async (req, res) => {
    const { doctorId } = req.params;
    const { city } = req.body;

    try {
      const doctor = await DoctorService.removeCity(doctorId, city);
      Response(res)
        .status(200)
        .message("City removed successfully")
        .body(doctor)
        .send();
    } catch (error) {
      throw new HttpError(404, error.message);
    }
  };

  // Advanced search endpoint
  searchDoctors = async (req, res) => {
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: ["fullName", "specialty", "mainCategory", "cities", "diseasesTreated"],
      customLabels: { docs: "doctors" },
    });

    // Remove the default 'deactivated' filter since Doctor model uses 'status' field
    delete filter.deactivated;

    const doctors = await DoctorService.paginate(filter, options);
    Response(res).body(...doctors).send();
  };

  // Get active doctors only
  getActiveDoctors = async (req, res) => {
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: ["fullName", "specialty"],
      customLabels: { docs: "doctors" },
    });
    
    filter.status = "active";
    const doctors = await DoctorService.paginate(filter, options);
    Response(res).body(...doctors).send();
  };

  // Get inactive doctors (Admin only)
  getInactiveDoctors = async (req, res) => {
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: ["fullName", "specialty"],
      customLabels: { docs: "doctors" },
    });
    
    filter.status = "inactive";
    const doctors = await DoctorService.paginate(filter, options);
    Response(res).body(...doctors).send();
  };

  // Get all unique specialties
  getSpecialties = async (req, res) => {
    const specialties = await DoctorService.modal.distinct("specialty");
    Response(res).body(specialties.sort()).send();
  };

  // Get all unique main categories
  getMainCategories = async (req, res) => {
    const categories = await DoctorService.modal.distinct("mainCategory");
    Response(res).body(categories.sort()).send();
  };

  // Get all practice cities
  getCities = async (req, res) => {
    const cities = await DoctorService.modal.distinct("cities");
    Response(res).body(cities.sort()).send();
  };

  // Get all professional titles
  getProfessionalTitles = async (req, res) => {
    const titles = await DoctorService.modal.distinct("professionalTitle");
    Response(res).body(titles.sort()).send();
  };

  // Get featured doctors (high-rated)
  getFeaturedDoctors = async (req, res) => {
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: ["fullName", "specialty"],
      customLabels: { docs: "doctors" },
      sort: { rating: -1, reviewCount: -1 },
    });
    
    filter.status = "active";
    filter.rating = { $gte: 4.0 };
    
    const doctors = await DoctorService.paginate(filter, options);
    Response(res).body(...doctors).send();
  };

  // Get nearby doctors (location-based)
  getNearbyDoctors = async (req, res) => {
    const { lat, lng, radius = 10 } = req.query;
    
    if (!lat || !lng) {
      throw new HttpError(400, "Latitude and longitude are required");
    }

    const { filter, options } = createQueryHelper(req.query, {
      searchFields: ["fullName", "specialty"],
      customLabels: { docs: "doctors" },
    });

    // Add geospatial query
    filter["mapCoordinates.latitude"] = {
      $gte: parseFloat(lat) - radius / 111,
      $lte: parseFloat(lat) + radius / 111
    };
    filter["mapCoordinates.longitude"] = {
      $gte: parseFloat(lng) - radius / 111,
      $lte: parseFloat(lng) + radius / 111
    };
    filter.status = "active";

    const doctors = await DoctorService.paginate(filter, options);
    Response(res).body(...doctors).send();
  };

  // Get doctor statistics (Admin)
  getDoctorStats = async (req, res) => {
    const stats = await DoctorService.modal.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
          inactive: { $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] } },
          visiting: { $sum: { $cond: ["$isVisitingDoctor", 1, 0] } },
          hospital: { $sum: { $cond: ["$isHospitalDoctor", 1, 0] } },
          avgRating: { $avg: "$rating" },
          avgFees: { $avg: "$consultationFees" }
        }
      }
    ]);

    const specialtyStats = await DoctorService.modal.aggregate([
      { $group: { _id: "$specialty", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    Response(res).body({
      overview: stats[0] || {},
      bySpecialty: specialtyStats
    }).send();
  };

  // Get doctor count
  getDoctorCount = async (req, res) => {
    const { filter } = createQueryHelper(req.query, {});
    const count = await DoctorService.modal.countDocuments(filter);
    Response(res).body({ count }).send();
  };

  // Get doctor reviews (placeholder)
  getDoctorReviews = async (req, res) => {
    const { doctorId } = req.params;
    // This would integrate with a reviews system
    Response(res).body({ reviews: [], message: "Reviews system not implemented yet" }).send();
  };

  // Get doctor availability (placeholder)
  getDoctorAvailability = async (req, res) => {
    const { doctorId } = req.params;
    // This would integrate with a scheduling system
    Response(res).body({ availability: [], message: "Availability system not implemented yet" }).send();
  };

  // Create bulk doctors (Admin)
  createBulkDoctors = async (req, res) => {
    const { doctors } = req.body;
    
    if (!Array.isArray(doctors)) {
      throw new HttpError(400, "Doctors must be an array");
    }

    const createdDoctors = await DoctorService.modal.insertMany(doctors);
    Response(res)
      .status(201)
      .message(`${createdDoctors.length} doctors created successfully`)
      .body({ count: createdDoctors.length, doctors: createdDoctors })
      .send();
  };

  // Add disease to doctor
  addDisease = async (req, res) => {
    const { doctorId } = req.params;
    const { disease } = req.body;

    const doctor = await DoctorService.findById(doctorId);
    if (!doctor) throw new HttpError(404, "Doctor not found");

    if (!doctor.diseasesTreated.includes(disease)) {
      doctor.diseasesTreated.push(disease);
      await doctor.save();
    }

    Response(res)
      .status(200)
      .message("Disease added successfully")
      .body(doctor)
      .send();
  };

  // Remove disease from doctor
  removeDisease = async (req, res) => {
    const { doctorId } = req.params;
    const { disease } = req.body;

    const doctor = await DoctorService.findById(doctorId);
    if (!doctor) throw new HttpError(404, "Doctor not found");

    doctor.diseasesTreated = doctor.diseasesTreated.filter(d => d !== disease);
    await doctor.save();

    Response(res)
      .status(200)
      .message("Disease removed successfully")
      .body(doctor)
      .send();
  };

  // Clone doctor profile (Admin)
  cloneDoctor = async (req, res) => {
    const { doctorId } = req.params;
    const doctor = await DoctorService.findById(doctorId);
    
    if (!doctor) throw new HttpError(404, "Doctor not found");

    const doctorData = doctor.toObject();
    delete doctorData._id;
    delete doctorData.createdAt;
    delete doctorData.updatedAt;
    doctorData.fullName = `${doctorData.fullName} (Copy)`;
    doctorData.employeeCode = null;

    const clonedDoctor = await DoctorService.create(doctorData);
    Response(res)
      .status(201)
      .message("Doctor cloned successfully")
      .body(clonedDoctor)
      .send();
  };

  // Update doctor rating (Admin)
  updateDoctorRating = async (req, res) => {
    const { doctorId } = req.params;
    const { rating, reviewCount } = req.body;

    const doctor = await DoctorService.findByIdAndUpdate(doctorId, { 
      rating: parseFloat(rating),
      ...(reviewCount && { reviewCount: parseInt(reviewCount) })
    });

    if (!doctor) throw new HttpError(404, "Doctor not found");

    Response(res)
      .status(200)
      .message("Doctor rating updated successfully")
      .body(doctor)
      .send();
  };

  // Update consultation fees (Admin)
  updateConsultationFees = async (req, res) => {
    const { doctorId } = req.params;
    const { consultationFees } = req.body;

    const doctor = await DoctorService.findByIdAndUpdate(doctorId, { 
      consultationFees: parseFloat(consultationFees)
    });

    if (!doctor) throw new HttpError(404, "Doctor not found");

    Response(res)
      .status(200)
      .message("Consultation fees updated successfully")
      .body(doctor)
      .send();
  };

  // Bulk update status (Admin)
  bulkUpdateStatus = async (req, res) => {
    const { doctorIds, status } = req.body;

    if (!Array.isArray(doctorIds) || !["active", "inactive"].includes(status)) {
      throw new HttpError(400, "Invalid request data");
    }

    const result = await DoctorService.modal.updateMany(
      { _id: { $in: doctorIds } },
      { status }
    );

    Response(res)
      .status(200)
      .message(`${result.modifiedCount} doctors updated successfully`)
      .body({ modifiedCount: result.modifiedCount })
      .send();
  };

  // Update qualification (Admin)
  updateQualification = async (req, res) => {
    const { doctorId, qualificationId } = req.params;
    const qualificationData = req.body;

    const doctor = await DoctorService.findById(doctorId);
    if (!doctor) throw new HttpError(404, "Doctor not found");

    const qualification = doctor.qualifications.id(qualificationId);
    if (!qualification) throw new HttpError(404, "Qualification not found");

    Object.assign(qualification, qualificationData);
    await doctor.save();

    Response(res)
      .status(200)
      .message("Qualification updated successfully")
      .body(doctor)
      .send();
  };

  // Bulk delete doctors (Admin)
  bulkDeleteDoctors = async (req, res) => {
    const { doctorIds } = req.body;

    if (!Array.isArray(doctorIds)) {
      throw new HttpError(400, "Doctor IDs must be an array");
    }

    const result = await DoctorService.modal.deleteMany({ _id: { $in: doctorIds } });

    Response(res)
      .status(200)
      .message(`${result.deletedCount} doctors deleted successfully`)
      .body({ deletedCount: result.deletedCount })
      .send();
  };
}

module.exports.DoctorController = new DoctorController();
