const express = require("express");
const notificationsController = require('../controllers/notifications');

var router = express.Router();

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get notifications
 *     tags: [Notifications]
 *     description: Retrieve the list of notifications for a user.
 *     operationId: getNotifications
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *
 * /notifications/markAsRead/{notificationId}:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     description: Mark a notification as read based on the provided notification ID.
 *     operationId: markAsRead
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         description: The ID of the notification to mark as read.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *
 * /notifications/deleteNotificationById/{notificationId}:
 *   delete:
 *     summary: Delete notification by ID
 *     tags: [Notifications]
 *     description: Delete a notification based on the provided notification ID.
 *     operationId: deleteNotificationById
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         description: The ID of the notification to delete.
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: No Content
 *
 * /notifications/createNotificationForOrganization:
 *   post:
 *     summary: Create notification for organization
 *     tags: [Notifications]
 *     description: Create a notification for the entire organization.
 *     operationId: createNotificationForOrganization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationRequestBody'
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *
 * /notifications/sendSwitchNotification/{userId}:
 *   post:
 *     summary: Send switch notification
 *     tags: [Notifications]
 *     description: Send a switch notification to a specific user.
 *     operationId: sendSwitchNotification
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to send the switch notification to.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The user ID.
 *         fromId:
 *           type: string
 *           description: The sender ID.
 *         message:
 *           type: string
 *           description: The notification message.
 *         isRead:
 *           type: boolean
 *           default: false
 *           description: Indicates whether the notification has been read.
 *         date:
 *           type: string
 *           format: date-time
 *           default: '2023-06-05T00:00:00.000Z'
 *           description: The date and time when the notification was created.
 *         notificationType:
 *           type: string
 *           enum: ['switch', 'notification', 'route']
 *           default: 'notification'
 *           description: The type of notification.
 *         switchID:
 *           type: string
 *           description: The ID of the switch.
 *         routeTo:
 *           type: string
 *           description: The route to which the notification is related.
 *     NotificationRequestBody:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The user ID.
 *         message:
 *           type: string
 *           description: The notification message.
 *         notificationType:
 *           type: string
 *           enum: ['switch', 'notification', 'route']
 *           default: 'notification'
 *           description: The type of notification.
 *         switchID:
 *           type: string
 *           description: The ID of the switch.
 *         routeTo:
 *           type: string
 *           description: The route to which the notification is related.
 * 
 */


router.get("/", express.json(), notificationsController.getNotifications);

router.put("/markAsRead/:notificationId", notificationsController.markAsRead);

router.delete("/deleteNotificationById/:notificationId", notificationsController.deleteNotificationById);

router.post("/createNotificationForOrganization", express.json(), notificationsController.createNotificationForOrganization);

router.post("/sendSwitchNotification/:userId", notificationsController.sendSwitchNotification);

module.exports = router;