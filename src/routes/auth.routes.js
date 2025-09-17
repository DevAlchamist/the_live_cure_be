const express = require("express");
const { UserController } = require("../controllers/user.controllers");
const { Auth } = require("../middlewares/auth.middlewares");

const router = express.Router();

// Public Authentication Endpoints
router.post("/login", UserController.loginViaPassword);
router.post("/register", UserController.createNewUser);
router.post("/forgot-password", UserController.forgotPassword);
router.post("/reset-password", UserController.resetPassword);

// Protected Authentication Endpoints
router.post("/logout", [Auth], UserController.logout);
router.get("/me", [Auth], UserController.getCurrentUser);
router.put("/profile", [Auth], UserController.editCurrentUser);
router.post("/change-password", [Auth], UserController.changePassword);

module.exports.AuthRouter = router;
