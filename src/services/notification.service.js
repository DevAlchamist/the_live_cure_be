const { NotificationModel } = require("../models/Notification.model");

class NotificationService {
  static async getUserNotifications({ userId, page, limit, type, status, read }) {
    try {
      const query = { userId };
      
      if (type) query.type = type;
      if (status) query.status = status;
      if (read !== undefined) query.read = read;

      const skip = (page - 1) * limit;
      
      const notifications = await NotificationModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('senderId', 'name email');

      const total = await NotificationModel.countDocuments(query);

      return {
        notifications,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      throw new Error(`Error getting user notifications: ${error.message}`);
    }
  }

  static async getUnreadNotifications({ userId, page, limit }) {
    try {
      const query = { userId, read: false };
      const skip = (page - 1) * limit;
      
      const notifications = await NotificationModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('senderId', 'name email');

      const total = await NotificationModel.countDocuments(query);

      return {
        notifications,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      throw new Error(`Error getting unread notifications: ${error.message}`);
    }
  }

  static async getNotificationCount(userId) {
    try {
      const count = await NotificationModel.countDocuments({ userId, read: false });
      return count;
    } catch (error) {
      throw new Error(`Error getting notification count: ${error.message}`);
    }
  }

  static async markAsRead(notificationId, userId) {
    try {
      const notification = await NotificationModel.findOneAndUpdate(
        { _id: notificationId, userId },
        { read: true, readAt: new Date() },
        { new: true }
      ).populate('senderId', 'name email');

      if (!notification) {
        throw new Error('Notification not found');
      }

      return notification;
    } catch (error) {
      throw new Error(`Error marking notification as read: ${error.message}`);
    }
  }

  static async markAsUnread(notificationId, userId) {
    try {
      const notification = await NotificationModel.findOneAndUpdate(
        { _id: notificationId, userId },
        { read: false, readAt: null },
        { new: true }
      ).populate('senderId', 'name email');

      if (!notification) {
        throw new Error('Notification not found');
      }

      return notification;
    } catch (error) {
      throw new Error(`Error marking notification as unread: ${error.message}`);
    }
  }

  static async markAllAsRead(userId) {
    try {
      const result = await NotificationModel.updateMany(
        { userId, read: false },
        { read: true, readAt: new Date() }
      );

      return { updatedCount: result.modifiedCount };
    } catch (error) {
      throw new Error(`Error marking all notifications as read: ${error.message}`);
    }
  }

  static async sendNotification({ title, message, type, recipientId, senderId, data }) {
    try {
      const notification = new NotificationModel({
        title,
        message,
        type,
        recipientId,
        senderId,
        data
      });

      await notification.save();
      await notification.populate('senderId', 'name email');

      return notification;
    } catch (error) {
      throw new Error(`Error sending notification: ${error.message}`);
    }
  }

  static async dismissNotification(notificationId, userId) {
    try {
      const notification = await NotificationModel.findOneAndUpdate(
        { _id: notificationId, userId },
        { dismissed: true, dismissedAt: new Date() },
        { new: true }
      ).populate('senderId', 'name email');

      if (!notification) {
        throw new Error('Notification not found');
      }

      return notification;
    } catch (error) {
      throw new Error(`Error dismissing notification: ${error.message}`);
    }
  }

  static async deleteNotification(notificationId, userId) {
    try {
      const notification = await NotificationModel.findOneAndDelete({
        _id: notificationId,
        userId
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      return notification;
    } catch (error) {
      throw new Error(`Error deleting notification: ${error.message}`);
    }
  }

  static async deleteAllNotifications(userId) {
    try {
      const result = await NotificationModel.deleteMany({ userId });
      return { deletedCount: result.deletedCount };
    } catch (error) {
      throw new Error(`Error deleting all notifications: ${error.message}`);
    }
  }
}

module.exports = { NotificationService };
