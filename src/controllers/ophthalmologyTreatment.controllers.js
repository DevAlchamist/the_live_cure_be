const HttpError = require("../helpers/HttpError.helpers");
const Response = require("../helpers/Response.helpers");
const { OphthalmologyTreatmentService } = require("../services/ophthalmologyTreatment.service");
const createQueryHelper = require("../helpers/Query.helper");

class OphthalmologyTreatmentController {
  // Create new treatment
  createTreatment = async (req, res) => {
    const treatment = await OphthalmologyTreatmentService.create(req.body);
    
    Response(res)
      .status(201)
      .message("Treatment created successfully")
      .body(treatment)
      .send();
  };

  // Get all treatments
  getAllTreatments = async (req, res) => {
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: ["title", "description"],
      unFilter: [],
      customFilters: (filter, query) => {
        if (query.status) filter.status = query.status;
        else filter.status = 'published'; // Default to published only
      },
    });

    const treatments = await OphthalmologyTreatmentService.paginate(filter, options);
    Response(res).body(treatments).send();
  };

  // Get treatment by ID
  getTreatmentById = async (req, res) => {
    const { id } = req.params;
    const treatment = await OphthalmologyTreatmentService.findById(id);
    
    if (!treatment) {
      throw new HttpError(404, "Treatment not found");
    }

    Response(res).body(treatment).send();
  };

  // Get treatment by disease name
  getTreatmentByDiseaseName = async (req, res) => {
    const { diseaseName } = req.params;
    const treatment = await OphthalmologyTreatmentService.findByDiseaseName(diseaseName);
    
    if (!treatment) {
      throw new HttpError(404, "Treatment not found for this disease");
    }

    Response(res).body(treatment).send();
  };

  // Update treatment
  updateTreatment = async (req, res) => {
    const { id } = req.params;
    const treatment = await OphthalmologyTreatmentService.findByIdAndUpdate(id, req.body);
    
    if (!treatment) {
      throw new HttpError(404, "Treatment not found");
    }

    Response(res)
      .status(200)
      .message("Treatment updated successfully")
      .body(treatment)
      .send();
  };

  // Delete treatment
  deleteTreatment = async (req, res) => {
    const { id } = req.params;
    const treatment = await OphthalmologyTreatmentService.findByIdAndDelete(id);
    
    if (!treatment) {
      throw new HttpError(404, "Treatment not found");
    }

    Response(res)
      .status(200)
      .message("Treatment deleted successfully")
      .send();
  };

  // Search treatments
  searchTreatments = async (req, res) => {
    const { q } = req.query;
    const { page = 1, limit } = req.query;
    
    if (!q) {
      throw new HttpError(400, "Search query is required");
    }

    const treatments = await OphthalmologyTreatmentService.searchTreatments(q, { page, limit });
    Response(res).body(treatments).send();
  };

  // Get treatment titles for navigation
  getTreatmentTitles = async (req, res) => {
    const titles = await OphthalmologyTreatmentService.getTreatmentTitles();
    Response(res).body(titles).send();
  };

  // Get all disease names
  getDiseaseNames = async (req, res) => {
    const diseaseNames = await OphthalmologyTreatmentService.getDiseaseNames();
    Response(res).body(diseaseNames).send();
  };
}

module.exports = { OphthalmologyTreatmentController: new OphthalmologyTreatmentController() };
