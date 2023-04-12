const express = require("express");
const middleware = require("../common/auth_middleware");
const Shift = require("../models/permanentShifts");
const { getShifts } = require("../controllers/permanentShifts");

var router = express.Router();

router.get("/", middleware, async (req, res) => {
  try {
    const shifts = await getShifts();
    res.send(shifts);
  } catch (err) {
    res.send("error occured to get shifts: " + err);
  }
});

router.post("/", middleware, async (req, res) => {
  try {
    const newShift = new Shift(req.body);
    const result = await newShift.save();
    res.send("success adding new permanent shift" + result);
  } catch (err) {
    res.send("error adding new permanent shift. error: " + err);
  }
});

module.exports = router;
