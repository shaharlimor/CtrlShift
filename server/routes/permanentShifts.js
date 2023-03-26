const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Shift = require("../models/permanentShifts");
const { getShifts } = require("../controllers/permanentShifts");

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
  const newShift = new Shift(req.body);
  newShift.save((err, result) => {
    if (err) {
      console.log(err);
      res.send("error creating shifts. error: " + err);
    }
  });
  res.send("success adding new permanent shift");
});

module.exports = router;
