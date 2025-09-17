const express = require("express");
const { Auth } = require("../middlewares/auth.middlewares");
const { NotificationController } = require("../controllers/notification.controllers");

const router = express.Router();

// GET requests - Protected endpoints
router.get("/", [Auth], NotificationController.getUserNotifications);
// Query params: page, limit, type, status, read

router.get("/unread", [Auth], NotificationController.getUnreadNotifications);
router.get("/count", [Auth], NotificationController.getNotificationCount);

// PUT requests
router.put("/:id/read", [Auth], NotificationController.markAsRead);
router.put("/:id/unread", [Auth], NotificationController.markAsUnread);
router.put("/all/read", [Auth], NotificationController.markAllAsRead);

// POST requests
router.post("/send", [Auth], NotificationController.sendNotification);
router.post("/:id/dismiss", [Auth], NotificationController.dismissNotification);

// DELETE requests
router.delete("/:id", [Auth], NotificationController.deleteNotification);
router.delete("/all", [Auth], NotificationController.deleteAllNotifications);

module.exports.NotificationRouter = router;
