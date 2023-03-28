const Constraint = require("../models/constraints");

const getConstraints = async () => {
  return await Constraint.find({}, "_id level description shiftId employeeId");
};

const getConstraintsByShiftId = async (id) => {
  return await Constraint.find({ shiftId: id });
};

const getConstraintsByEmployeeId = async (id) => {
  return await Constraint.find({ employeeId: id });
};

module.exports = {
  getConstraints,
  getConstraintsByShiftId,
  getConstraintsByEmployeeId,
};
