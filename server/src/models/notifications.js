const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  userId: String,
  fromId: String,
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
  shiftId: String,
  requestShiftId: String,
  routeTo: String
});

// Compile model from schema
module.exports = mongoose.model("Notification", notificationSchema);
