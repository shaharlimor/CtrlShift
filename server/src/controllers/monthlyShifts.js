const Shift = require("../models/monthlyShifts");
const permanentShift = require("../models/permanentShifts");
const Schedule = require("../models/schedule");
const Common = require("../controllers/common");
const User = require("../models/users");

const { scheduleShifts } = require("../controllers/Algo");
const { getAllUsersByOrganization } = require("../controllers/users");
const { getConstraintsByOrganization } = require("../controllers/constraints");

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

    // console.log("sagi", existingMonthsSet);

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
  const user = await Common.getUserByRT(req);
  const userOrg = user.organization;

  const users = await User.find({ organization: userOrg });

  const constraints = await getConstraintsByOrganization(userOrg);

  const monthlyShifts = await Shift.find().exec();
  const assignedShifts = await scheduleShifts(
    monthlyShifts,
    users,
    constraints
  );

  // const bulkOps = assignedShifts.map((shift) => ({
  //   updateOne: {
  //     filter: { _id: shift._id },
  //     update: { assignedEmployee: shift.assignedEmployee },
  //   },
  // }));

  // await Shift.bulkWrite(bulkOps);
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
  generateScheduleMonthlyShifts,
};
