const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShiftRolesSchema = new Schema({
  organization: String,
  roleType: String
});

// Compile model from schema
module.exports = mongoose.model("ShiftRoles", userSchema);