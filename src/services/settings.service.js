const Settings = require("../models/Settings.model");

class SettingsService {
  // Get settings by type
  getByType = async (type) => {
    return await Settings.findOne({ type });
  };

  // Create or update settings
  upsert = async (type, data, updatedBy = null) => {
    const settings = await Settings.findOneAndUpdate(
      { type },
      { 
        data,
        updatedBy,
        lastUpdated: new Date()
      },
      { 
        upsert: true, 
        new: true 
      }
    );
    return settings;
  };

  // Get all settings
  getAll = async () => {
    return await Settings.find().sort({ type: 1 });
  };

  // Delete settings
  deleteByType = async (type) => {
    return await Settings.findOneAndDelete({ type });
  };

  // Get general settings
  getGeneralSettings = async () => {
    const settings = await this.getByType('general');
    return settings ? settings.data : {
      siteName: "The Live Cure",
      siteDescription: "Your trusted healthcare partner",
      contactEmail: "contact@thelivecure.com",
      contactPhone: "+1-800-HEALTH",
      address: "123 Healthcare St, Medical City, MC 12345",
      website: "https://thelivecure.com"
    };
  };

  // Get notification settings
  getNotificationSettings = async () => {
    const settings = await this.getByType('notifications');
    return settings ? settings.data : {
      emailNotifications: true,
      smsNotifications: true,
      bookingReminders: true,
      systemAlerts: true,
      marketingEmails: false
    };
  };

  // Get security settings
  getSecuritySettings = async () => {
    const settings = await this.getByType('security');
    return settings ? settings.data : {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5
    };
  };

  // Get appearance settings
  getAppearanceSettings = async () => {
    const settings = await this.getByType('appearance');
    return settings ? settings.data : {
      theme: 'light',
      primaryColor: '#3B82F6',
      logoUrl: '/images/logo.png',
      faviconUrl: '/images/favicon.ico'
    };
  };

  // Update general settings
  updateGeneralSettings = async (data, updatedBy = null) => {
    return await this.upsert('general', data, updatedBy);
  };

  // Update notification settings
  updateNotificationSettings = async (data, updatedBy = null) => {
    return await this.upsert('notifications', data, updatedBy);
  };

  // Update security settings
  updateSecuritySettings = async (data, updatedBy = null) => {
    return await this.upsert('security', data, updatedBy);
  };

  // Update appearance settings
  updateAppearanceSettings = async (data, updatedBy = null) => {
    return await this.upsert('appearance', data, updatedBy);
  };
}

module.exports = { SettingsService: new SettingsService() };
