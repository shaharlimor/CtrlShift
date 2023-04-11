const express = require("express");
const Constraint = require("../models/constraints");
const middleware = require("../common/auth_middleware");
const {
  getConstraints,
  getConstraintsByShiftId,
  getConstraintsByEmployeeId,
  employeeHasConstraintInShift,
} = require("../controllers/constraints");

var router = express.Router();

router.get("/", middleware, async (req, res) => {
  try {
    const constraints = await getConstraints();
    res.send(constraints);
  } catch (err) {
    res.send("error occured to get constraints: " + err);
  }
});

router.get("/byShift/:id", middleware, async (req, res) => {
  try {
    const id = req.params.id;
    const constraints = await getConstraintsByShiftId(id);
    res.send(constraints);
  } catch (err) {
    res.send(err);
  }
});

router.get("/byEmployee/:id", middleware, async (req, res) => {
  try {
    const id = req.params.id;
    const constraints = await getConstraintsByEmployeeId(id);
    res.send(constraints);
  } catch (err) {
    res.send(err);
  }
});

router.get(
  "/userHasConstraint/:employeeId/:shiftId",
  middleware,
  async (req, res) => {
    try {
      const employeeId = req.params.employeeId;
      const shiftId = req.params.shiftId;
      const ans = await employeeHasConstraintInShift(employeeId, shiftId);
      res.send(ans);
    } catch (err) {
      res.send(err);
    }
  }
);

router.post("/", middleware, async (req, res) => {
  try {
    const newConstraint = new Constraint(req.body);
    const result = await newConstraint.save();
    res.send("success adding new constraint" + result);
  } catch (err) {
    res.send("error adding constraint. error: " + err);
  }
});

module.exports = router;
