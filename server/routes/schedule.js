const express = require("express");
// const middleware = require("../common/auth_middleware");
const Schedule = require("../models/schedule");
const {
  getSchedules,
  changeOpenToConstraints,
  getScheByMonthYearOrganization,
  changePublish,
} = require("../controllers/schedule");

var router = express.Router();

router.get("/", async (req, res) => {
  try {
    const schedules = await getSchedules();
    res.send(schedules);
  } catch (err) {
    res.send("error occured to get schedules: " + err);
  }
});

router.post("/", async (req, res) => {
  try {
    const newSche = new Schedule(req.body);
    const result = await newSche.save();
    res.send("success adding new schedule " + result);
  } catch (err) {
    res.send("error adding new schedule. error: " + err);
  }
});

router.patch("/startInsertConstraints/", async (req, res) => {
  try {
    const result = await changeOpenToConstraints(
      req.body.organization,
      req.body.month,
      req.body.year
    );
    res.send(result);
  } catch (err) {
    res.send("change start insert constraint failed. error: " + err);
  }
});

router.patch("/publishBoard/", async (req, res) => {
  try {
    const result = await changePublish(
      req.body.organization,
      req.body.month,
      req.body.year
    );
    res.send(result);
  } catch (err) {
    res.send("Publish board failed. error: " + err);
  }
});

module.exports = router;
