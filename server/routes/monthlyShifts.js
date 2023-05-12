const express = require("express");
const middleware = require("../common/auth_middleware");
const Shift = require("../models/monthlyShifts");
const {
  getShifts,
  getBoardListOfMonthlyShift,
  getMissingBoardList,
  createMonthlyShiftBoard,
  deleteShiftById,
  getShiftsOpenToConstraints,
  getShiftsOpenToConstraintsByRoles,
  getShiftsPublished,
  changeEmployeesInShift,
  getShiftById,
} = require("../controllers/monthlyShifts");

var router = express.Router();

router.get("/DoesntExist", middleware, getMissingBoardList);

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
    const shifts = await createMonthlyShiftBoard(req);
    res.send(shifts);
  } catch (err) {
    res.send("error occured to post shifts: " + err);
  }
});

router.delete("/:id", middleware, async (req, res) => {
  try {
    const id = req.params.id;
    await deleteShiftById(id);
    res.status(200).send(`success deleted shift ${id}`);
  } catch (err) {
    res.status(404).send("Error to delete shift " + err);
  }
});

router.get("/published/:organization", middleware, async (req, res) => {
  try {
    const organization = req.params.organization;
    const shifts = await getShiftsPublished(organization);
    res.send(shifts);
  } catch (err) {
    res.send("error occured to get shifts: " + err);
  }
});

router.get("/openToConstraints/:organization", middleware, async (req, res) => {
  try {
    const organization = req.params.organization;
    const shifts = await getShiftsOpenToConstraints(organization);
    res.send(shifts);
  } catch (err) {
    res.send("error occured to get shifts: " + err);
  }
});

router.get(
  "/openToConstraintsByRoles/:organization/:role_types",
  middleware,
  async (req, res) => {
    try {
      const organization = req.params.organization;
      const role_types = req.params.role_types;
      const shifts = await getShiftsOpenToConstraintsByRoles(
        organization,
        role_types
      );
      res.send(shifts);
    } catch (err) {
      res.send("error occured to get shifts: " + err);
    }
  }
);

router.get("/byId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const shifts = await getShiftById(id);
    res.send(shifts);
  } catch (err) {
    res.send("error occured to get shifts: " + err);
  }
});

router.patch("/assingEmployees/:id", async (req, res) => {
  try {
    const result = await changeEmployeesInShift(req.params.id, req.body.roles);
    res.send(result);
  } catch (err) {
    res.send(
      "failed to update employees in shift " + req.params.id + " error: " + err
    );
  }
});

module.exports = router;
