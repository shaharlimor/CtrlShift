const Constraint = require("../models/constraints");
const MonthlyShift = require("../models/monthlyShifts");
const Notification = require("../models/notifications");
const Schedule = require("../models/schedule");
const SwapRequests = require("../models/swapRequests");
const ShiftRoles = require("../models/shiftRoles");
const PermanentShifts = require("../models/permanentShifts");
const User = require("../models/user");

const fs = require("fs");
const path = require("path");

const deleteData = async () => {
  try {
    await Constraint.deleteMany({});
    await MonthlyShift.deleteMany({});
    await Notification.deleteMany({});
    await Schedule.deleteMany({});
    await SwapRequests.deleteMany({});
    remainRoles = [
      "644550ba27d00a0ff0453ffa",
      "644550dd27d00a0ff0453ffd",
      "644550f727d00a0ff0454000",
      "6445510c27d00a0ff0454003",
    ];
    await ShiftRoles.deleteMany({
      _id: { $nin: remainRoles.map((id) => id.toString()) },
    });
    remainPermShifts = ["645cd41531eea8fabe794ab1", "644551d527d00a0ff0454018"];
    await PermanentShifts.deleteMany({
      _id: { $nin: remainPermShifts.map((id) => id.toString()) },
    });
    remainUsers = [
      "4c0a8029",
      "ab945ba2",
      "14585c78",
      "b8738a28",
      "c092905e",
      "d0e0e9d2",
      "7a01d3e1",
    ];
    await User.deleteMany({
      _id: { $nin: remainUsers.map((id) => id.toString()) },
    });
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
    // "shiftRoles",
    // "permanentShifts",
    // "users",
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
