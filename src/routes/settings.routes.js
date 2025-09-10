const express = require("express");
const { SettingsController } = require("../controllers/settings.controllers");
const { Auth } = require("../middlewares/auth.middlewares");

const router = express.Router();

// GET requests - Public endpoints (some settings may be public)
router.get("/general", SettingsController.getGeneralSettings);
router.get("/notifications", SettingsController.getNotificationSettings);
router.get("/security", SettingsController.getSecuritySettings);
router.get("/appearance", SettingsController.getAppearanceSettings);
router.get("/all", [Auth], SettingsController.getAllSettings);

// PUT requests (Admin only)
router.put("/general", [Auth], SettingsController.updateGeneralSettings);
router.put("/notifications", [Auth], SettingsController.updateNotificationSettings);
router.put("/security", [Auth], SettingsController.updateSecuritySettings);
router.put("/appearance", [Auth], SettingsController.updateAppearanceSettings);

module.exports = { SettingsRouter: router };
