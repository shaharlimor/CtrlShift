const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Constraint = require("../models/constraints");
const {
  getConstraints,
  getConstraintsByShiftId,
  getConstraintsByEmployeeId,
} = require("../controllers/constraints");

var router = express.Router();

router.get("/", async (req, res) => {
  try {
    const constraints = await getConstraints();
    res.send(constraints);
  } catch (err) {
    res.send("error occured to get constraints: " + err);
  }
});

router.get("/byShift/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const constraints = await getConstraintsByShiftId(id);
    res.send(constraints);
  } catch (err) {
    res.send(err);
  }
});

router.get("/byEmployee/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const constraints = await getConstraintsByEmployeeId(id);
    res.send(constraints);
  } catch (err) {
    res.send(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const newConstraint = new Constraint(req.body);
    const result = await newConstraint.save();
    res.send("success adding new constraint shift" + result);
  } catch (err) {
    res.send("error adding constraint. error: " + err);
  }
});

module.exports = router;
