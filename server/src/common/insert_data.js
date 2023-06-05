const Constraint = require("../models/constraints");
const MonthlyShift = require("../models/monthlyShifts");
const Notification = require("../models/notifications");
const Schedule = require("../models/schedule");
const SwapRequests = require("../models/swapRequests");
const fs = require("fs");
const path = require("path");

const deleteData = async () => {
  try {
    await Constraint.deleteMany({});
    await MonthlyShift.deleteMany({});
    await Notification.deleteMany({});
    await Schedule.deleteMany({});
    await SwapRequests.deleteMany({});
    return;
  } catch (error) {
    return res.status(404).send(error.message);
  }
};

const insertData = async (req, res) => {
  const collections = [
    "constraints",
    "monthlyShifts",
    "notifications",
    "schedule",
    "swapRequests",
  ];
  const insertedData = {};

  try {
    for (const collection of collections) {
      const filePath = path.join(
        __dirname,
        "data",
        `CtrlShift.${collection}.json`
      );
      const jsonData = fs.readFileSync(filePath);
      const data = JSON.parse(jsonData);
      const Model = require(`../models/${collection}`);
      insertedData[collection] = await Model.insertMany(data);
    }

    return insertedData;
  } catch (error) {
    throw error.message;
  }
};

module.exports = {
  deleteData,
  insertData,
};
