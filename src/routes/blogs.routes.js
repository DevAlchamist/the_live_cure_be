const express = require("express");
const { BlogController } = require("../controllers/blog.controllers");
const { Auth } = require("../middlewares/auth.middlewares");

const router = express.Router();

// GET requests - Public endpoints
router.get("/", BlogController.getAllBlogs);
// Query params: page, limit, search, sort, category, featured, status

router.get("/featured", BlogController.getFeaturedBlogs);
// Query params: page, limit

router.get("/categories", BlogController.getCategories);

router.get("/recent", BlogController.getRecentBlogs);
// Query params: limit

router.get("/search", BlogController.searchBlogs);
// Query params: q (query), page, limit

router.get("/category/:category", BlogController.getBlogsByCategory);
// Query params: page, limit

router.get("/slug/:slug", BlogController.getBlogBySlug);

router.get("/:id", BlogController.getBlogById);

// POST requests (Admin only)
router.post("/", [Auth], BlogController.createBlog);

// PUT requests (Admin only)
router.put("/:id", [Auth], BlogController.updateBlog);

// DELETE requests (Admin only)
router.delete("/:id", [Auth], BlogController.deleteBlog);

module.exports = { BlogRouter: router };
