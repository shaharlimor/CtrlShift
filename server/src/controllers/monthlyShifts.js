const Shift = require("../models/monthlyShifts");
const permanentShift = require("../models/permanentShifts");
const Schedule = require("../models/schedule");
const User = require("../models/users");
const Common = require("../controllers/common");
const Constraint = require("../models/constraints");

const { scheduleShifts } = require("../controllers/Algo");
const { getAllUsersByOrganization } = require("../controllers/users");
const { getConstraintsByOrganization } = require("./constraints");
const { changeEmployessAssigned } = require("../controllers/schedule");

const getShifts = async (organization) => {
  return await Shift.find(
    { organization: organization },
    "_id organization startTime endTime name roles"
  );
};

const getBoardListOfMonthlyShift = async (organization) => {
  return await Schedule.aggregate([
    { $match: { organization: organization } },
    {
      $project: {
        _id: 0,
        year: "$year",
        month: "$month",
      },
    },
  ]);
};

const getMissingBoardList = async (req, res) => {
  try {
    const user = await Common.getUserByRT(req);
    const userOrg = user.organization;

    const now = new Date();
    const nextYear = now.getFullYear() + 1;
    const missingMonths = [];

    // Find all existing months in the next 12 months
    const existingMonths = await Shift.find(
      {
        organization: userOrg,
        startTime: { $gte: now, $lte: new Date(`${nextYear}-12-31`) },
      },
      { startTime: 1 }
    ).lean();

    // Create a set of all existing months
    const existingMonthsSet = new Set(
      existingMonths.map(({ startTime }) => {
        const date = new Date(startTime);
        return JSON.stringify({
          month: date.getMonth() + 1,
          year: date.getFullYear(),
        });
      })
    );

    // Loop through the next 12 months and add missing months to the missingMonths array
    for (let year = now.getFullYear(); year <= nextYear; year++) {
      const startMonth = year === now.getFullYear() ? now.getMonth() : 0;
      for (let month = startMonth; month < 12; month++) {
        const monthNum = month + 1;
        const monthObj = { month: monthNum, year: year };
        const monthStr = JSON.stringify(monthObj); // Convert to string representation
        if (!existingMonthsSet.has(monthStr)) {
          // Check for membership using string representation
          missingMonths.push(monthObj);
        }
      }
    }

    res.status(200).json(missingMonths);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving missing board list", error });
  }
};

const createMonthlyShiftBoard = async (req, res) => {
  const user = await Common.getUserByRT(req);
  const userOrg = user.organization;
  const year = req.body.year;
  const month = req.body.month;

  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  const permanentShifts = await permanentShift
    .find({
      organization: userOrg,
    })
    .exec();

  const monthlyShifts = [];

  for (let i = 1; i <= endOfMonth.getDate(); i++) {
    const date = new Date(year, month - 1, i);

    permanentShifts.forEach((permanentShift) => {
      if (permanentShift.days.includes(getDayOfWeek(date))) {
        const dayIndex = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].indexOf(getDayOfWeek(date));

        const shiftStart = new Date(
          year,
          month - 1,
          i,
          permanentShift.startTime.getHours().toString().padStart(2, "0"),
          permanentShift.startTime.getMinutes().toString().padStart(2, "0")
        );
        const shiftEnd = new Date(
          year,
          month - 1,
          i,
          permanentShift.endTime.getHours().toString().padStart(2, "0"),
          permanentShift.endTime.getMinutes().toString().padStart(2, "0")
        );

        monthlyShifts.push({
          organization: userOrg,
          startTime: shiftStart,
          endTime: shiftEnd,
          name: permanentShift.name,
          roles: permanentShift.roles,
        });
      }
    });
  }

  await Shift.insertMany(monthlyShifts);

  const newSchedule = new Schedule({
    organization: userOrg,
    month: month,
    year: year,
    isPublished: false,
    isOpenToConstraints: false,
    employessAssigned: false,
  });

  await newSchedule.save();
};

function getDayOfWeek(date) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysOfWeek[date.getDay()];
}

const deleteShiftById = async (id) => {
  try {
    if (id === "" || id === null) {
      return res.status(404).send("shift not found");
    }
    return await Shift.deleteOne({ _id: id });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getShiftsOpenToConstraints = async (organization) => {
  // Get The month and year open to insert constraints
  const scheOpenToInsert = await Schedule.find(
    { organization: organization, isOpenToConstraints: true },
    "month year"
  );

  // Get shifts that open to insert constraints according to boards that open
  const shifts = await Shift.find({
    organization: organization,
    $expr: {
      $in: [
        {
          $concat: [
            { $toString: { $month: "$startTime" } }, // Extract and convert month to string
            "-",
            { $toString: { $year: "$startTime" } }, // Extract and convert year to string
          ],
        },
        scheOpenToInsert.map(({ month, year }) => `${month}-${year}`), // Map array of objects to concatenated month-year strings
      ],
    },
  });

  return shifts;
};

const getShiftsOpenToConstraintsByRoles = async (organization, role_types) => {
  // Get The month and year open to insert constraints
  const shifts = await getShiftsOpenToConstraints(organization);

  // Filter shifts to only include those that have at least one role with a matching role type
  const filteredShifts = shifts.filter((shift) => {
    // Check if any role in the shift has a role type that matches one of the role types provided
    return shift.roles.some((role) => {
      return role_types.includes(role.roleType);
    });
  });

  return filteredShifts;
};

const ShiftsByRoleType = async (roleType, startTime) => {
  // Convert startTime to a Date object if it is not already
  const startDate = new Date(startTime);

  // Extract the year and month from the provided start time
  const year = startDate.getFullYear();
  const month = startDate.getMonth() + 1; // Month is zero-based, so add 1

  // Create the start and end dates of the specified month
  const startDateOfMonth = new Date(year, month - 1, 1);
  const endDateOfMonth = new Date(year, month, 0, 23, 59, 59, 999); // Set the time to the last millisecond of the month

  // Retrieve shifts with matching role type and within the specified month
  const shifts = await Shift.find({
    "roles.roleType": roleType,
    startTime: { $gte: startDateOfMonth, $lte: endDateOfMonth },
  }).exec();

  // Create an array to store the formatted shifts
  const formattedShifts = [];

  // Iterate over each shift
  for (const shift of shifts) {
    // Iterate over each role within the shift
    for (const role of shift.roles) {
      // Check if the role matches the specified roleType
      if (role.roleType === roleType) {
        // Iterate over each employee within the role
        for (const employeeId of role.employeeIds) {
          // Retrieve the user details from the User collection
          const user = await User.findOne({ _id: employeeId }).exec();

          // Check if the user exists and has the required fields
          if (user && user.firstName && user.lastName) {
            // Create a new shift object for the employee
            const formattedShift = {
              _id: shift._id,
              role: roleType,
              employeeId: employeeId,
              firstName: user.firstName,
              lastName: user.lastName,
              startTime: shift.startTime,
              endTime: shift.endTime,
            };

            // Push the formatted shift to the result array
            formattedShifts.push(formattedShift);
          }
        }
      }
    }
  }

  return formattedShifts;
};

const ShiftsByMonth = async (organization, month, year) => {
  // Create the start and end dates of the specified month
  const startDateOfMonth = new Date(year, month - 1, 1);
  const endDateOfMonth = new Date(year, month, 0, 23, 59, 59, 999); // Set the time to the last millisecond of the month

  // Retrieve shifts with matching role type and within the specified month
  const shifts = await Shift.find({
    organization: organization,
    startTime: { $gte: startDateOfMonth, $lte: endDateOfMonth },
  }).exec();

  return shifts;
};

const getShiftsPublished = async (organization) => {
  // Get The month and year published
  const schePublished = await Schedule.find(
    { organization: organization, isPublished: true },
    "month year"
  );

  // Get shifts that published according to boards that open
  const shifts = await Shift.find({
    organization: organization,
    $expr: {
      $in: [
        {
          $concat: [
            { $toString: { $month: "$startTime" } }, // Extract and convert month to string
            "-",
            { $toString: { $year: "$startTime" } }, // Extract and convert year to string
          ],
        },
        schePublished.map(({ month, year }) => `${month}-${year}`), // Map array of objects to concatenated month-year strings
      ],
    },
  });

  return shifts;
};

const getShiftById = async (id) => {
  return await Shift.find(
    { _id: id },
    "_id organization startTime endTime name roles"
  );
};

const changeEmployeesInShift = async (id, roles) => {
  const monthlyShift = await getShiftById(id);
  if (!monthlyShift || !monthlyShift.length) return "Monthly shift not found";
  const shiftDocument = monthlyShift[0]; // access the first document in the array

  const newRoles = roles;
  shiftDocument.roles = shiftDocument.roles.map((oldRole) => {
    const newRole = newRoles.find((role) => role.roleType === oldRole.roleType);
    return newRole ? { ...oldRole, employeeIds: newRole.employeeIds } : oldRole;
  });
  await shiftDocument.save();
  return shiftDocument;
};

const generateScheduleMonthlyShifts = async (req, res) => {
  const month = req.params.month;
  const year = req.params.year;

  const user = await Common.getUserByRT(req);
  const userOrg = user.organization;

  const users = await User.find({ organization: userOrg });

  const constraints = await Constraint.find({ userOrg });

  const monthlyShifts = await ShiftsByMonth(userOrg, month, year);
  const assignedShifts = await scheduleShifts(
    monthlyShifts,
    users,
    constraints
  );

  // change the month in schduale schema to generated
  await changeEmployessAssigned(userOrg, month, year, true);
};

module.exports = {
  getShifts,
  getBoardListOfMonthlyShift,
  getMissingBoardList,
  createMonthlyShiftBoard,
  deleteShiftById,
  getShiftsOpenToConstraints,
  getShiftsOpenToConstraintsByRoles,
  getShiftsPublished,
  getShiftById,
  changeEmployeesInShift,
  ShiftsByRoleType,
  generateScheduleMonthlyShifts,
};
