const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  userId: String,
  message: String,
  isRead: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['switch', 'notification', 'route'],
    default: 'notification'
  },
  routeTo: String
});

// Compile model from schema
module.exports = mongoose.model("Notification", notificationSchema);
