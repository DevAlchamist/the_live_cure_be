const HttpError = require("../helpers/HttpError.helpers");
const Response = require("../helpers/Response.helpers");
const { PatientStoryService } = require("../services/patientStory.service");
const createQueryHelper = require("../helpers/Query.helper");

class PatientStoryController {
  // Create new patient story
  createPatientStory = async (req, res) => {
    const story = await PatientStoryService.create(req.body);
    
    Response(res)
      .status(201)
      .message("Patient story created successfully")
      .body(story)
      .send();
  };

  // Get all patient stories
  getAllPatientStories = async (req, res) => {
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: ["name", "condition", "story", "outcome"],
      unFilter: [],
      customFilters: (filter, query) => {
        if (query.category) filter.category = query.category;
        if (query.condition) filter.condition = { $regex: query.condition, $options: 'i' };
        if (query.featured !== undefined) filter.featured = query.featured === 'true';
        if (query.verified !== undefined) filter.verified = query.verified === 'true';
        if (query.minRating) filter.rating = { $gte: parseInt(query.minRating) };
        if (query.status) filter.status = query.status;
        else filter.status = 'published'; // Default to published only
      },
    });

    const stories = await PatientStoryService.paginate(filter, options);
    Response(res).body(stories).send();
  };

  // Get patient story by ID
  getPatientStoryById = async (req, res) => {
    const { id } = req.params;
    const story = await PatientStoryService.findById(id);
    
    if (!story) {
      throw new HttpError(404, "Patient story not found");
    }

    Response(res).body(story).send();
  };

  // Update patient story
  updatePatientStory = async (req, res) => {
    const { id } = req.params;
    const story = await PatientStoryService.findByIdAndUpdate(id, req.body);
    
    if (!story) {
      throw new HttpError(404, "Patient story not found");
    }

    Response(res)
      .status(200)
      .message("Patient story updated successfully")
      .body(story)
      .send();
  };

  // Delete patient story
  deletePatientStory = async (req, res) => {
    const { id } = req.params;
    const story = await PatientStoryService.findByIdAndDelete(id);
    
    if (!story) {
      throw new HttpError(404, "Patient story not found");
    }

    Response(res)
      .status(200)
      .message("Patient story deleted successfully")
      .send();
  };

  // Get featured patient stories
  getFeaturedStories = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const stories = await PatientStoryService.getFeaturedStories({ page, limit });
    Response(res).body(stories).send();
  };

  // Get stories by category
  getStoriesByCategory = async (req, res) => {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const stories = await PatientStoryService.getStoriesByCategory(category, { page, limit });
    Response(res).body(stories).send();
  };

  // Get stories by condition
  getStoriesByCondition = async (req, res) => {
    const { condition } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const stories = await PatientStoryService.getStoriesByCondition(condition, { page, limit });
    Response(res).body(stories).send();
  };

  // Search patient stories
  searchStories = async (req, res) => {
    const { q } = req.query;
    const { page = 1, limit = 10 } = req.query;
    
    if (!q) {
      throw new HttpError(400, "Search query is required");
    }

    const stories = await PatientStoryService.searchStories(q, { page, limit });
    Response(res).body(stories).send();
  };

  // Get all categories
  getCategories = async (req, res) => {
    const categories = await PatientStoryService.getCategories();
    Response(res).body(categories).send();
  };

  // Get all conditions
  getConditions = async (req, res) => {
    const conditions = await PatientStoryService.getConditions();
    Response(res).body(conditions).send();
  };

  // Get recent stories
  getRecentStories = async (req, res) => {
    const { limit = 5 } = req.query;
    const stories = await PatientStoryService.getRecentStories(parseInt(limit));
    Response(res).body(stories).send();
  };

  // Get stories by rating
  getStoriesByRating = async (req, res) => {
    const { minRating = 4 } = req.query;
    const { page = 1, limit = 10 } = req.query;
    const stories = await PatientStoryService.getStoriesByRating(parseInt(minRating), { page, limit });
    Response(res).body(stories).send();
  };

  // Verify story
  verifyStory = async (req, res) => {
    const { id } = req.params;
    const story = await PatientStoryService.verifyStory(id);
    
    if (!story) {
      throw new HttpError(404, "Patient story not found");
    }

    Response(res)
      .status(200)
      .message("Patient story verified successfully")
      .body(story)
      .send();
  };
}

module.exports = { PatientStoryController: new PatientStoryController() };
