const Shift = require("../models/monthlyShifts");
const Schedule = require("../models/schedule");

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

const getMissingBoardList = async (organization) => {
  const now = new Date();
  const nextYear = now.getFullYear() + 1;
  const missingMonths = [];

  // Find all existing months in the next 12 months
  const existingMonths = await Shift.find(
    {
      organization: organization,
      startTime: { $gte: now, $lte: new Date(`${nextYear}-12-31`) },
    },
    { startTime: 1 }
  ).lean();

  // Create a set of all existing months
  const existingMonthsSet = new Set(
    existingMonths.map(({ startTime }) => {
      const date = new Date(startTime);
      return { month: date.getMonth() + 1, year: date.getFullYear() };
    })
  );

  // Loop through the next 12 months and add missing months to the missingMonths array
  for (let year = now.getFullYear(); year <= nextYear; year++) {
    for (let month = 0; month < 12; month++) {
      const monthNum = month + 1;
      const monthObj = { organization: organization, month: monthNum, year };
      if (!existingMonthsSet.has(monthObj)) {
        missingMonths.push(monthObj);
      }
    }
  }

  return missingMonths;
};

const createMonthlyShiftBoard = async (month, year, organization) => {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  const permanentShifts = await Shift.find({
    organization: organization,
    days: { $in: [startOfMonth.getDay().toString()] },
  }).exec();

  console.log("permanent shifts: ", permanentShifts);

  const monthlyShifts = [];

  permanentShifts.forEach((permanentShift) => {
    permanentShift.days.forEach((day) => {
      const date = new Date(
        year,
        month - 1,
        parseInt(day),
        permanentShift.startTime.getHours(),
        permanentShift.startTime.getMinutes()
      );

      monthlyShifts.push({
        organization: permanentShift.organization,
        startTime: date,
        endTime: new Date(
          year,
          month - 1,
          parseInt(day),
          permanentShift.endTime.getHours(),
          permanentShift.endTime.getMinutes()
        ),
        name: permanentShift.name,
        roles: permanentShift.roles,
      });
    });
  });

  await Shift.insertMany(monthlyShifts);

  const newSchedule = new Schedule({
    organization: organization,
    month: month,
    year: year,
    isPublished: false,
    isOpenToConstraints: false,
  });

  await newSchedule.save();
};

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

module.exports = {
  getShifts,
  getBoardListOfMonthlyShift,
  getMissingBoardList,
  createMonthlyShiftBoard,
  deleteShiftById,
  getShiftsOpenToConstraints,
};
