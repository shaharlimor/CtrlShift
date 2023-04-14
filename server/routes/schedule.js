const express = require("express");
const middleware = require("../common/auth_middleware");
const Schedule = require("../models/schedule");
const {
  getSchedules,
  changeOpenToConstraints,
  boardOpenToConstraints,
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

router.post("/", middleware, async (req, res) => {
  try {
    const newSche = new Schedule(req.body);
    const result = await newSche.save();
    res.send("success adding new schedule " + result);
  } catch (err) {
    res.send("error adding new schedule. error: " + err);
  }
});

router.patch("/startInsertConstraints/", middleware, async (req, res) => {
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

router.patch("/publishBoard/", middleware, async (req, res) => {
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

router.get("/openToConstraints", async (req, res) => {
  try {
    const ans = await boardOpenToConstraints(
      req.body.organization,
      req.body.month,
      req.body.year
    );
    res.send(ans);
  } catch (err) {
    res.send("error to check if board open to insert constraints: " + err);
  }
});

module.exports = router;
