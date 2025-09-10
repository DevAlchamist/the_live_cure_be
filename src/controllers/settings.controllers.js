const HttpError = require("../helpers/HttpError.helpers");
const Response = require("../helpers/Response.helpers");
const { SettingsService } = require("../services/settings.service");

class SettingsController {
  // Get general settings
  getGeneralSettings = async (req, res) => {
    const settings = await SettingsService.getGeneralSettings();
    Response(res).body(settings).send();
  };

  // Update general settings
  updateGeneralSettings = async (req, res) => {
    const settings = await SettingsService.updateGeneralSettings(req.body, req.user?._id);
    
    Response(res)
      .status(200)
      .message("General settings updated successfully")
      .body(settings.data)
      .send();
  };

  // Get notification settings
  getNotificationSettings = async (req, res) => {
    const settings = await SettingsService.getNotificationSettings();
    Response(res).body(settings).send();
  };

  // Update notification settings
  updateNotificationSettings = async (req, res) => {
    const settings = await SettingsService.updateNotificationSettings(req.body, req.user?._id);
    
    Response(res)
      .status(200)
      .message("Notification settings updated successfully")
      .body(settings.data)
      .send();
  };

  // Get security settings
  getSecuritySettings = async (req, res) => {
    const settings = await SettingsService.getSecuritySettings();
    Response(res).body(settings).send();
  };

  // Update security settings
  updateSecuritySettings = async (req, res) => {
    const settings = await SettingsService.updateSecuritySettings(req.body, req.user?._id);
    
    Response(res)
      .status(200)
      .message("Security settings updated successfully")
      .body(settings.data)
      .send();
  };

  // Get appearance settings
  getAppearanceSettings = async (req, res) => {
    const settings = await SettingsService.getAppearanceSettings();
    Response(res).body(settings).send();
  };

  // Update appearance settings
  updateAppearanceSettings = async (req, res) => {
    const settings = await SettingsService.updateAppearanceSettings(req.body, req.user?._id);
    
    Response(res)
      .status(200)
      .message("Appearance settings updated successfully")
      .body(settings.data)
      .send();
  };

  // Get all settings
  getAllSettings = async (req, res) => {
    const settings = await SettingsService.getAll();
    Response(res).body(settings).send();
  };
}

module.exports = { SettingsController: new SettingsController() };
