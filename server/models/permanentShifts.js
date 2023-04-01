const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const permanentShiftSchema = new Schema({
  organization: String,
  startTime: Date,
  endTime: Date,
  days: [String],
  name: String,
  roles: [
    {
      roleType: String,
      amount: Number,
    },
  ],
});

// Compile model from schema
module.exports = mongoose.model("PermanentShift", permanentShiftSchema);
