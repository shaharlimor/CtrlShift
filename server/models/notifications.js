const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    userId: String,
    notification: String
});

// Compile model from schema
module.exports = mongoose.model("Notification", userSchema);