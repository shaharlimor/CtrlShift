const express = require("express");
const Constraint = require("../models/constraints");
const { deleteData, insertData } = require("../common/insert_data");

var router = express.Router();

router.delete("/", async (req, res) => {
  try {
    await deleteData();
    res.status(200).send(`success deleted data`);
  } catch (err) {
    res.status(500).send("Error to delete data " + err);
  }
});

router.post("/", async (req, res) => {
  try {
    await insertData();
    res.status(200).send(`success adding data`);
  } catch (err) {
    res.status(500).send("Error to insert data " + err);
  }
});

module.exports = router;
