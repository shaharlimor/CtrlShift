const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const monthlyShiftSchema = new Schema({
    organization: String,
    startTime: Date,
    endTime: Date,
    date: Date,
    name: String,
    roles: [{
      roleType:String,
      amount: Number,
      employeeIds: [String]
    }],
});

// Compile model from schema
module.exports = mongoose.model("monthlyShift", userSchema);