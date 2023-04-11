const Shift = require("../models/monthlyShifts");
const Schedule = require("../models/schedule");

const getShifts = async (organization) => {
  return await Shift.find(
    { organization: organization },
    "_id organization startTime endTime name roles"
  );
};

const getBoardListOfMonthlyShift = async (organization) => {
  console.log(organization);
  return await Shift.aggregate([
    { $match: { organization: organization } },
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
        organization: "$organization",
        year: "$_id.year",
        month: "$_id.month",
      },
    },
  ]);
};

const getMissingBoardListOfMonthlyShiftOfYear = async (organization) => {
  console.log(organization);

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

  console.log("exisiting month set: ", existingMonthsSet);

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

  console.log("missing Months: ", missingMonths);

  return missingMonths;
};

const createMonthlyShiftBoard = async (month, year, organization) => {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  const permanentShifts = await Shift.find({
    organization: organization,
    days: { $in: [startOfMonth.getDay().toString()] },
  }).exec();

  console.log("premenent shifts: ", permanentShifts);

  const monthlyShifts = permanentShifts.map((permanentShift) => {
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

  const newSchedule = new Schedule({
    organization: organization,
    month: month,
    year: year,
    isPublished: false,
    isOpenToConstraints: false,
  });

  newSchedule.save((err) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      console.log("Schedule saved successfully!");
      return null;
    }
  });
};

module.exports = {
  getShifts,
  getBoardListOfMonthlyShift,
  getMissingBoardListOfMonthlyShiftOfYear,
  createMonthlyShiftBoard,
};
