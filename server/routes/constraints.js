const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { uuid } = require("uuidv4");
const axios = require("axios");
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

app.get("/byShift/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const constraints = await getConstraintsByShiftId(id);
    res.send(constraints);
  } catch (err) {
    res.send(err);
  }
});

app.get("/byEmployee/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const constraints = await getConstraintsByEmployeeId(id);
    res.send(constraints);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
