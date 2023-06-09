const express = require("express");
const middleware = require("../common/auth_middleware");
const Schedule = require("../models/schedule");
const {
  getSchedules,
  changeOpenToConstraints,
  boardOpenToConstraints,
  changePublish,
  changeEmployessAssigned,
  isEmployeesAssigned,
} = require("../controllers/schedule");

var router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Schedule
 *   description: API endpoints for managing schedules
 */

/**
 * @swagger
 * /schedule:
 *   get:
 *     summary: Get all schedules
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create a new schedule
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schedule'
 *     responses:
 *       200:
 *         description: Successful response with the new schedule
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /schedule/startInsertConstraints:
 *   patch:
 *     summary: Change the "isOpenToConstraints" status to true for a specific schedule
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organization:
 *                 type: string
 *               month:
 *                 type: number
 *               year:
 *                 type: number
 *     responses:
 *       200:
 *         description: Successful response with the updated schedule
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /schedule/publishBoard:
 *   patch:
 *     summary: Change the "isPublished" status to true for a specific schedule
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organization:
 *                 type: string
 *               month:
 *                 type: number
 *               year:
 *                 type: number
 *     responses:
 *       200:
 *         description: Successful response with the updated schedule
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /schedule/openToConstraints:
 *   get:
 *     summary: Check if a specific schedule is open to insert constraints
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: organization
 *         schema:
 *           type: string
 *         required: true
 *         description: The organization of the schedule
 *       - in: query
 *         name: month
 *         schema:
 *           type: number
 *         required: true
 *         description: The month of the schedule
 *       - in: query
 *         name: year
 *         schema:
 *           type: number
 *         required: true
 *         description: The year of the schedule
 *     responses:
 *       200:
 *         description: Successful response indicating if the schedule is open to insert constraints
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /schedule/employessAssigned:
 *   patch:
 *     summary: Change the "employessAssigned" status for a specific schedule
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organization:
 *                 type: string
 *               month:
 *                 type: number
 *               year:
 *                 type: number
 *               changeTo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Successful response with the updated schedule
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     summary: Check if employees are assigned for a specific schedule
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: organization
 *         schema:
 *           type: string
 *         required: true
 *         description: The organization of the schedule
 *       - in: query
 *         name: month
 *         schema:
 *           type: number
 *         required: true
 *         description: The month of the schedule
 *       - in: query
 *         name: year
 *         schema:
 *           type: number
 *         required: true
 *         description: The year of the schedule
 *     responses:
 *       200:
 *         description: Successful response indicating if employees are assigned
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Schedule:
 *       type: object
 *       properties:
 *         organization:
 *           type: string
 *         month:
 *           type: number
 *         year:
 *           type: number
 *         isPublished:
 *           type: boolean
 *         isOpenToConstraints:
 *           type: boolean
 *         employessAssigned:
 *           type: boolean
 */

router.get("/", middleware, async (req, res) => {
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
    res.send(result);
  } catch (err) {
    res.send("error adding new schedule. error: " + err);
  }
});

router.patch("/startInsertConstraints", middleware, async (req, res) => {
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

router.patch("/publishBoard", middleware, async (req, res) => {
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

router.get("/openToConstraints", middleware, async (req, res) => {
  try {
    const ans = await boardOpenToConstraints(
      req.query.organization,
      req.query.month,
      req.query.year
    );
    res.send(ans);
  } catch (err) {
    res.send("error to check if board open to insert constraints: " + err);
  }
});

router.patch("/employeesAssigned", middleware, async (req, res) => {
  try {
    const result = await changeEmployeesAssigned(
      req.body.organization,
      req.body.month,
      req.body.year,
      req.body.changeTo
    );
    res.send(result);
  } catch (err) {
    res.send("Change employees assigned status failed: " + err);
  }
});

router.get("/employeesAssigned", middleware, async (req, res) => {
  try {
    const ans = await isEmployeesAssigned(
      req.query.organization,
      req.query.month,
      req.query.year
    );
    res.send(ans);
  } catch (err) {
    res.send("error to check if employees are assigned: " + err);
  }
});

module.exports = router;
