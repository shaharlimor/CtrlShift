const express = require("express");
const Constraint = require("../models/constraints");
const { deleteData, insertData } = require("../common/insert_data");

var router = express.Router();

// router.get("/", async (req, res) => {
//   try {
//     const organization = req.params.organization;
//     const constraints = await getConstraints(organization);
//     res.send(constraints);
//   } catch (err) {
//     res.send("error occurred to get constraints: " + err);
//   }
// });

// router.post("/", async (req, res) => {
//   try {
//     const newConstraint = new Constraint(req.body);
//     const result = await newConstraint.save();
//     res.send("success adding new constraint" + result);
//   } catch (err) {
//     res.send("error adding constraint. error: " + err);
//   }
// });

router.delete("/", async (req, res) => {
  try {
    await deleteData();
    res.status(200).send(`success deleted constraints`);
  } catch (err) {
    res.status(500).send("Error to delete constraints " + err);
  }
});

router.post("/", async (req, res) => {
    try {
      await insertData();
      res.status(200).send(`success adding constraints`);
    } catch (err) {
      res.status(500).send("Error to add constraints " + err);
    }
  });

module.exports = router;
