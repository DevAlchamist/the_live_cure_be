const HttpError = require("../helpers/HttpError.helpers");
const Response = require("../helpers/Response.helpers");
const { BlogService } = require("../services/blog.service");
const createQueryHelper = require("../helpers/Query.helper");

class BlogController {
  // Create new blog post
  createBlog = async (req, res) => {
    const blog = await BlogService.create(req.body);
    
    Response(res)
      .status(201)
      .message("Blog post created successfully")
      .body(blog)
      .send();
  };

  // Get all blog posts
  getAllBlogs = async (req, res) => {
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: ["title", "content", "excerpt", "author"],
      unFilter: [],
      customFilters: (filter, query) => {
        if (query.category) filter.category = query.category;
        if (query.featured !== undefined) filter.featured = query.featured === 'true';
        if (query.status) filter.status = query.status;
        else filter.status = 'published'; // Default to published only
      },
    });

    const blogs = await BlogService.paginate(filter, options);
    Response(res).body(blogs).send();
  };

  // Get blog by ID
  getBlogById = async (req, res) => {
    const { id } = req.params;
    const blog = await BlogService.findById(id);
    
    if (!blog) {
      throw new HttpError(404, "Blog post not found");
    }

    // Increment view count
    await BlogService.incrementViews(id);

    Response(res).body(blog).send();
  };

  // Get blog by slug
  getBlogBySlug = async (req, res) => {
    const { slug } = req.params;
    const blog = await BlogService.findBySlug(slug);
    
    if (!blog) {
      throw new HttpError(404, "Blog post not found");
    }

    // Increment view count
    await BlogService.incrementViews(blog._id);

    Response(res).body(blog).send();
  };

  // Update blog post
  updateBlog = async (req, res) => {
    const { id } = req.params;
    const blog = await BlogService.findByIdAndUpdate(id, req.body);
    
    if (!blog) {
      throw new HttpError(404, "Blog post not found");
    }

    Response(res)
      .status(200)
      .message("Blog post updated successfully")
      .body(blog)
      .send();
  };

  // Delete blog post
  deleteBlog = async (req, res) => {
    const { id } = req.params;
    const blog = await BlogService.findByIdAndDelete(id);
    
    if (!blog) {
      throw new HttpError(404, "Blog post not found");
    }

    Response(res)
      .status(200)
      .message("Blog post deleted successfully")
      .send();
  };

  // Get featured blog posts
  getFeaturedBlogs = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const blogs = await BlogService.getFeaturedBlogs({ page, limit });
    Response(res).body(blogs).send();
  };

  // Get blogs by category
  getBlogsByCategory = async (req, res) => {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const blogs = await BlogService.getBlogsByCategory(category, { page, limit });
    Response(res).body(blogs).send();
  };

  // Search blogs
  searchBlogs = async (req, res) => {
    const { q } = req.query;
    const { page = 1, limit = 10 } = req.query;
    
    if (!q) {
      throw new HttpError(400, "Search query is required");
    }

    const blogs = await BlogService.searchBlogs(q, { page, limit });
    Response(res).body(blogs).send();
  };

  // Get all categories
  getCategories = async (req, res) => {
    const categories = await BlogService.getCategories();
    Response(res).body(categories).send();
  };

  // Get recent blogs
  getRecentBlogs = async (req, res) => {
    const { limit = 5 } = req.query;
    const blogs = await BlogService.getRecentBlogs(parseInt(limit));
    Response(res).body(blogs).send();
  };
}

module.exports = { BlogController: new BlogController() };
