const Constraint = require("../models/constraints");
const fs = require("fs");
const path = require("path");

const deleteData = async () => {
  try {
    return await Constraint.deleteMany({});
  } catch (error) {
    return res.status(404).send(error.message);
  }
};

const insertData = async (req, res) => {
  const filePath = path.join(__dirname, "CtrlShift.constraints.json");
  const jsonData = fs.readFileSync(filePath);
  const data = JSON.parse(jsonData);
  console.log(data);
  try {
    return await Constraint.insertMany(data);
  } catch (error) {
    throw error.message;
  }
};

module.exports = {
  deleteData,
  insertData,
};
