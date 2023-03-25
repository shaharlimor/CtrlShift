const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  password: String,
  organization: String,
  role_types: [String],
  isAdmin: Boolean,
  tokens: {
    type: [String]
  }
});

// Compile model from schema
module.exports = mongoose.model("User", userSchema);
