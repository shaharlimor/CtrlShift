const Shift = require("../models/permanentShifts");

const getShifts = async () => {
  return await Shift.find(
    {},
    "_id organization startTime endTime days name roles"
  );
};

module.exports = {
  getShifts,
};
