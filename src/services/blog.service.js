const Blog = require("../models/Blog.model");
const createQueryHelper = require("../helpers/Query.helper");

class BlogService {
  // Create new blog post
  create = async (data) => {
    const blog = new Blog(data);
    return await blog.save();
  };

  // Get all blog posts with pagination and filters
  paginate = async (filter, options) => {
    return await Blog.paginate(filter, options);
  };

  // Find blog by ID
  findById = async (id) => {
    return await Blog.findById(id);
  };

  // Find blog by slug
  findBySlug = async (slug) => {
    return await Blog.findOne({ slug });
  };

  // Update blog post
  findByIdAndUpdate = async (id, data) => {
    return await Blog.findByIdAndUpdate(id, data, { new: true });
  };

  // Delete blog post
  findByIdAndDelete = async (id) => {
    return await Blog.findByIdAndDelete(id);
  };

  // Get featured blog posts
  getFeaturedBlogs = async (options = {}) => {
    const { page = 1, limit = 10 } = options;
    return await Blog.paginate(
      { featured: true, status: 'published' },
      { page, limit, sort: { createdAt: -1 } }
    );
  };

  // Get blogs by category
  getBlogsByCategory = async (category, options = {}) => {
    const { page = 1, limit = 10 } = options;
    return await Blog.paginate(
      { category, status: 'published' },
      { page, limit, sort: { createdAt: -1 } }
    );
  };

  // Search blogs
  searchBlogs = async (query, options = {}) => {
    const { page = 1, limit = 10 } = options;
    return await Blog.paginate(
      { 
        $text: { $search: query },
        status: 'published'
      },
      { 
        page, 
        limit, 
        sort: { score: { $meta: 'textScore' }, createdAt: -1 }
      }
    );
  };

  // Increment view count
  incrementViews = async (id) => {
    return await Blog.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );
  };

  // Get all categories
  getCategories = async () => {
    return await Blog.distinct('category', { status: 'published' });
  };

  // Get recent blogs
  getRecentBlogs = async (limit = 5) => {
    return await Blog.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('title slug excerpt image createdAt readTime');
  };
}

module.exports = { BlogService: new BlogService() };
