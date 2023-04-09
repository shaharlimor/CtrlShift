const express = require("express");
const Shift = require("../models/monthlyShifts");
const {
  getShifts,
  getBoardListOfMonthlyShift,
  getMissingBoardListOfMonthlyShiftOfYear,
  createMonthlyShiftBoard,
} = require("../controllers/monthlyShifts");

var router = express.Router();

router.get("/:organization", async (req, res) => {
  try {
    const organization = req.params.organization;
    const shifts = await getShifts(organization);
    res.send(shifts);
  } catch (err) {
    res.send("error occured to get shifts: " + err);
  }
});

router.get("/MonthAndYearList", async (req, res) => {
  try {
    const MonthAndYearList = await getBoardListOfMonthlyShift();
    res.send(MonthAndYearList);
    console.log(MonthAndYearList);
  } catch (err) {
    res.send("error occured to get shifts: " + err);
  }
});

router.get("/DoesntExistMonthAndYearList", async (req, res) => {
  try {
    const MonthAndYearList = await getMissingBoardListOfMonthlyShiftOfYear();
    res.send(MonthAndYearList);
  } catch (err) {
    res.send("error occured to get shifts: " + err);
  }
});

router.post("/", async (req, res) => {
  try {
    const newShift = new Shift(req.body);
    const result = await newShift.save();
    res.send("success adding new monthly shift" + result);
  } catch (err) {
    res.send("error adding new monthly shift. error: " + err);
  }
});

router.post("/createMonthlyShiftBoard", async (req, res) => {
  try {
    const shifts = await createMonthlyShiftBoard(req.body.month, req.body.year);
    res.send(shifts);
  } catch (err) {
    res.send("error occured to post shifts: " + err);
  }
});

module.exports = router;
