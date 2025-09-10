const OphthalmologyTreatment = require("../models/OphthalmologyTreatment.model");

class OphthalmologyTreatmentService {
  // Create new treatment
  create = async (data) => {
    const treatment = new OphthalmologyTreatment(data);
    return await treatment.save();
  };

  // Get all treatments with pagination and filters
  paginate = async (filter, options) => {
    return await OphthalmologyTreatment.paginate(filter, options);
  };

  // Find treatment by ID
  findById = async (id) => {
    return await OphthalmologyTreatment.findById(id);
  };

  // Find treatment by URL
  findByUrl = async (url) => {
    return await OphthalmologyTreatment.findOne({ url });
  };

  // Find treatment by disease name (from URL)
  findByDiseaseName = async (diseaseName) => {
    const url = `/treatments/ophthalmology/${diseaseName}`;
    return await OphthalmologyTreatment.findOne({ url });
  };

  // Update treatment
  findByIdAndUpdate = async (id, data) => {
    return await OphthalmologyTreatment.findByIdAndUpdate(id, data, { new: true });
  };

  // Delete treatment
  findByIdAndDelete = async (id) => {
    return await OphthalmologyTreatment.findByIdAndDelete(id);
  };

  // Get all treatments
  getAllTreatments = async (options = {}) => {
    const { page = 1, limit = 10 } = options;
    return await OphthalmologyTreatment.paginate(
      { status: 'published' },
      { page, limit, sort: { title: 1 } }
    );
  };

  // Search treatments
  searchTreatments = async (query, options = {}) => {
    const { page = 1, limit = 10 } = options;
    return await OphthalmologyTreatment.paginate(
      { 
        $text: { $search: query },
        status: 'published'
      },
      { 
        page, 
        limit, 
        sort: { score: { $meta: 'textScore' }, title: 1 }
      }
    );
  };

  // Get treatment titles for navigation
  getTreatmentTitles = async () => {
    return await OphthalmologyTreatment.find(
      { status: 'published' },
      { title: 1, url: 1 }
    ).sort({ title: 1 });
  };

  // Get all disease names
  getDiseaseNames = async () => {
    const treatments = await OphthalmologyTreatment.find(
      { status: 'published' },
      { url: 1 }
    );
    
    return treatments.map(treatment => {
      const urlParts = treatment.url.split('/');
      return urlParts[urlParts.length - 1];
    });
  };
}

module.exports = { OphthalmologyTreatmentService: new OphthalmologyTreatmentService() };
