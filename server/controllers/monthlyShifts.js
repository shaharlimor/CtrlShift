const Shift = require("../models/monthlyShifts");

const getShifts = async () => {
  return await Shift.find({}, "_id organization startTime endTime name roles");
};

module.exports = {
  getShifts,
};
