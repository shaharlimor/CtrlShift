const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Schedulechema = new Schema({
  organization: String,
  month: Number,
  year: Number,
  isPublished: Boolean,
  isOpenToConstraints: Boolean,
});

// Compile model from schema
module.exports = mongoose.model("Schedule", Schedulechema);
