const express = require("express");
const notificationsController = require('../controllers/notifications');

var router = express.Router();

router.get("/", express.json(), notificationsController.getNotifications);

router.put("/markAsRead/:notificationId", notificationsController.markAsRead);

router.delete("/deleteNotificationById/:notificationId", notificationsController.deleteNotificationById);

router.post("/createNotificationForOrganization", express.json(), notificationsController.createNotificationForOrganization);

router.post("/sendSwitchNotification/:userId", notificationsController.sendSwitchNotification);

module.exports = router;