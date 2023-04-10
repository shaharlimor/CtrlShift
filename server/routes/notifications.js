const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const notificationsController = require('../controllers/notifications');

var router = express.Router();

router.get("/", express.json(), notificationsController.getNotifications);

router.put("/markAsRead/:notificationId", notificationsController.markAsRead);

router.delete("/deleteNotificationById/:notificationId", notificationsController.deleteNotificationById);

router.post("/createNotificationForOrganization", express.json(), notificationsController.createNotificationForOrganization);

module.exports = router;