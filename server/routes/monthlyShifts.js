const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Shift = require("../models/monthlyShifts");
const { getShifts } = require("../controllers/monthlyShifts");

var router = express.Router();

router.get("/", async (req, res) => {
  try {
    const shifts = await getShifts();
    res.send(shifts);
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

module.exports = router;
