const Constraint = require("../models/constraints");
const Shift = require("../models/monthlyShifts");
const User = require("../models/users");
const { getShifts } = require("../controllers/monthlyShifts");

const getConstraints = async (organization) => {
  // Find all the shifts that match the given organization
  const shifts = await getShifts(organization);

  // Get an array of shift IDs from the matching shifts
  const shiftIds = shifts.map((shift) => shift._id);

  // Find all the constraints that have a matching shift ID and organization
  return await Constraint.find({
    shiftId: { $in: shiftIds },
  });
};

const getConstraintsByShiftId = async (id) => {
  return await Constraint.find({ shiftId: id });
};

const getConstraintsByEmployeeId = async (id) => {
  return await Constraint.find({ employeeId: id });
};

const getEmployeesWithConstarintsInShift = async (shiftId) => {
  const constraints = await getConstraintsByShiftId(shiftId);
  const employeeIds = constraints.map((constraint) => constraint.employeeId);
  const employees = await User.find(
    { _id: { $in: employeeIds } },
    { firstName: 1, lastName: 1 }
  );
  return employees;
};

const employeeHasConstraintInShift = async (userId, shiftId) => {
  const ans = await Constraint.find({
    employeeId: userId,
    shiftId: shiftId,
  });
  return ans.length != 0;
};

const getConstraintsByOrganization = async (organization) => {
  return await Constraint.find({ organization }).exec();
};

module.exports = {
  getConstraints,
  getConstraintsByShiftId,
  getConstraintsByEmployeeId,
  employeeHasConstraintInShift,
  getEmployeesWithConstarintsInShift,
  getConstraintsByOrganization,
};
