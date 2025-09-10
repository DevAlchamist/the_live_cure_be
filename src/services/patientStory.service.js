const PatientStory = require("../models/PatientStory.model");

class PatientStoryService {
  // Create new patient story
  create = async (data) => {
    const story = new PatientStory(data);
    return await story.save();
  };

  // Get all patient stories with pagination and filters
  paginate = async (filter, options) => {
    return await PatientStory.paginate(filter, options);
  };

  // Find story by ID
  findById = async (id) => {
    return await PatientStory.findById(id);
  };

  // Update patient story
  findByIdAndUpdate = async (id, data) => {
    return await PatientStory.findByIdAndUpdate(id, data, { new: true });
  };

  // Delete patient story
  findByIdAndDelete = async (id) => {
    return await PatientStory.findByIdAndDelete(id);
  };

  // Get featured patient stories
  getFeaturedStories = async (options = {}) => {
    const { page = 1, limit = 10 } = options;
    return await PatientStory.paginate(
      { featured: true, status: 'published', verified: true },
      { page, limit, sort: { createdAt: -1 } }
    );
  };

  // Get stories by category
  getStoriesByCategory = async (category, options = {}) => {
    const { page = 1, limit = 10 } = options;
    return await PatientStory.paginate(
      { category, status: 'published', verified: true },
      { page, limit, sort: { createdAt: -1 } }
    );
  };

  // Get stories by condition
  getStoriesByCondition = async (condition, options = {}) => {
    const { page = 1, limit = 10 } = options;
    return await PatientStory.paginate(
      { 
        condition: { $regex: condition, $options: 'i' },
        status: 'published',
        verified: true
      },
      { page, limit, sort: { createdAt: -1 } }
    );
  };

  // Search patient stories
  searchStories = async (query, options = {}) => {
    const { page = 1, limit = 10 } = options;
    return await PatientStory.paginate(
      { 
        $text: { $search: query },
        status: 'published',
        verified: true
      },
      { 
        page, 
        limit, 
        sort: { score: { $meta: 'textScore' }, createdAt: -1 }
      }
    );
  };

  // Get all categories
  getCategories = async () => {
    return await PatientStory.distinct('category', { status: 'published', verified: true });
  };

  // Get all conditions
  getConditions = async () => {
    return await PatientStory.distinct('condition', { status: 'published', verified: true });
  };

  // Get recent stories
  getRecentStories = async (limit = 5) => {
    return await PatientStory.find({ status: 'published', verified: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name age condition outcome rating createdAt image');
  };

  // Get stories by rating
  getStoriesByRating = async (minRating = 4, options = {}) => {
    const { page = 1, limit = 10 } = options;
    return await PatientStory.paginate(
      { 
        rating: { $gte: minRating },
        status: 'published',
        verified: true
      },
      { page, limit, sort: { rating: -1, createdAt: -1 } }
    );
  };

  // Verify story
  verifyStory = async (id) => {
    return await PatientStory.findByIdAndUpdate(
      id,
      { verified: true },
      { new: true }
    );
  };
}

module.exports = { PatientStoryService: new PatientStoryService() };
