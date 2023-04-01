const Shift = require("../models/monthlyShifts");

const getShifts = async () => {
  return await Shift.find({}, "_id organization startTime endTime name roles");
};

const getMonthAndYearExist = async () => {
  return await Shift.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$startTime" },
          month: { $month: "$startTime" },
        },
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
      },
    },
  ]);
};

const getMissingMonthAndYear = async () => {
  const now = new Date();
  const nextYear = now.getFullYear() + 1;
  const missingMonths = [];

  // Find all existing months in the next 12 months
  const existingMonths = await Shift.find(
    {
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
      const monthObj = { month: monthNum, year };
      if (!existingMonthsSet.has(monthObj)) {
        missingMonths.push(monthObj);
      }
    }
  }

  return missingMonths;
};

const createMonthlyShiftBoard = async (month, year) => {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  const permanentShifts = await Shift.find({
    days: { $in: [startOfMonth.getDay().toString()] },
  }).exec();

  const monthlyShifts = Shift.map((permanentShift) => {
    return {
      organization: permanentShift.organization,
      startTime: new Date(
        year,
        month - 1,
        parseInt(permanentShift.days[0]),
        permanentShift.startTime.getHours(),
        permanentShift.startTime.getMinutes()
      ),
      endTime: new Date(
        year,
        month - 1,
        parseInt(permanentShift.days[0]),
        permanentShift.endTime.getHours(),
        permanentShift.endTime.getMinutes()
      ),
      name: permanentShift.name,
      roles: permanentShift.roles,
    };
  });

  await Shift.insertMany(monthlyShifts);
};

module.exports = {
  getShifts,
  getMonthAndYearExist,
  getMissingMonthAndYear,
  createMonthlyShiftBoard,
};
