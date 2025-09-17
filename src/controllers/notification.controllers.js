const { NotificationService } = require("../services/notification.service");
const { ResponseHelper } = require("../helpers/Response.helpers");

class NotificationController {
  static async getUserNotifications(req, res) {
    try {
      const { page = 1, limit = 10, type, status, read } = req.query;
      const userId = req.user.id;

      const notifications = await NotificationService.getUserNotifications({
        userId,
        page: parseInt(page),
        limit: parseInt(limit),
        type,
        status,
        read: read === 'true'
      });

      ResponseHelper.success(res, "Notifications retrieved successfully", notifications);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async getUnreadNotifications(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const userId = req.user.id;

      const notifications = await NotificationService.getUnreadNotifications({
        userId,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      ResponseHelper.success(res, "Unread notifications retrieved successfully", notifications);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async getNotificationCount(req, res) {
    try {
      const userId = req.user.id;

      const count = await NotificationService.getNotificationCount(userId);

      ResponseHelper.success(res, "Notification count retrieved successfully", { count });
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const notification = await NotificationService.markAsRead(id, userId);

      ResponseHelper.success(res, "Notification marked as read", notification);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async markAsUnread(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const notification = await NotificationService.markAsUnread(id, userId);

      ResponseHelper.success(res, "Notification marked as unread", notification);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;

      const result = await NotificationService.markAllAsRead(userId);

      ResponseHelper.success(res, "All notifications marked as read", result);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async sendNotification(req, res) {
    try {
      const notificationData = req.body;
      const senderId = req.user.id;

      const notification = await NotificationService.sendNotification({
        ...notificationData,
        senderId
      });

      ResponseHelper.success(res, "Notification sent successfully", notification);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async dismissNotification(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const notification = await NotificationService.dismissNotification(id, userId);

      ResponseHelper.success(res, "Notification dismissed", notification);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async deleteNotification(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await NotificationService.deleteNotification(id, userId);

      ResponseHelper.success(res, "Notification deleted successfully");
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }

  static async deleteAllNotifications(req, res) {
    try {
      const userId = req.user.id;

      const result = await NotificationService.deleteAllNotifications(userId);

      ResponseHelper.success(res, "All notifications deleted successfully", result);
    } catch (error) {
      ResponseHelper.error(res, error.message, error.statusCode || 500);
    }
  }
}

module.exports = { NotificationController };
