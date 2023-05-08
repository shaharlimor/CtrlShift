const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const constraintSchema = new Schema({
  level: String,
  description: String,
  shiftId: String,
  employeeId: String,
});

// Compile model from schema
module.exports = mongoose.model("Constraint", constraintSchema);
