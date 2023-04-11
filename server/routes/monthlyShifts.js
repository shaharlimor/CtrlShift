const express = require("express");
const middleware = require("../common/auth_middleware");
const Shift = require("../models/monthlyShifts");
const {
  getShifts,
  getBoardListOfMonthlyShift,
  getMissingBoardList,
  createMonthlyShiftBoard,
} = require("../controllers/monthlyShifts");

var router = express.Router();

router.get("/:organization", middleware, async (req, res) => {
  try {
    const organization = req.params.organization;
    const shifts = await getShifts(organization);
    res.send(shifts);
  } catch (err) {
    res.send("error occured to get shifts: " + err);
  }
});

router.get(
  "/monthOpendToAddShiftsList/:organization",
  middleware,
  async (req, res) => {
    try {
      const organization = req.params.organization;
      const MonthAndYearList = await getBoardListOfMonthlyShift(organization);
      res.send(MonthAndYearList);
    } catch (err) {
      res.send("error occured to get shifts: " + err);
    }
  }
);

router.get("/DoesntExist/:organization", async (req, res) => {
  try {
    console.log("here");
    const organization = req.params.organization;
    console.log("org ", organization);
    const MonthAndYearList = await getMissingBoardList(organization);
    res.send(MonthAndYearList);
  } catch (err) {
    res.send("error occured to get shifts: " + err);
  }
});

router.post("/", middleware, async (req, res) => {
  try {
    const newShift = new Shift(req.body);
    const result = await newShift.save();
    res.send("success adding new monthly shift" + result);
  } catch (err) {
    res.send("error adding new monthly shift. error: " + err);
  }
});

router.post("/createMonthlyShiftBoard", middleware, async (req, res) => {
  try {
    const shifts = await createMonthlyShiftBoard(req.body.month, req.body.year);
    res.send(shifts);
  } catch (err) {
    res.send("error occured to post shifts: " + err);
  }
});

module.exports = router;
