const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const swapRequestsSchema = new Schema({
    userId: String,
    shiftId: String,
    requestUserId: String,
    status: String
});

// Compile model from schema
module.exports = mongoose.model("SwapRequest", userSchema);