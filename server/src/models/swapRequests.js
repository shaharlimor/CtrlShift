const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const swapRequestsSchema = new Schema({
  userId: String,
  shiftId: String,
  requestUserId: String,
  requestShiftId: String,
  status: {
    type: String,
    enum: ['requested', 'approved', 'rejected'],
    default: 'requested'
  },
});

// Compile model from schema
module.exports = mongoose.model("SwapRequest", swapRequestsSchema);
