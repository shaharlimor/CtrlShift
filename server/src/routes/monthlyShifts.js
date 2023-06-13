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
  generateScheduleMonthlyShifts,
  getShiftById,
  ShiftsByRoleType,
} = require("../controllers/monthlyShifts");

var router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Monthly Shift
 *   description: API endpoints for managing monthly shifts
 */

/**
 * @swagger
 * /monthlyShifts/DoesntExist:
 *   get:
 *     summary: Get missing board list
 *     tags: [Monthly Shift]
 *     description: Retrieve the missing board list.
 *     responses:
 *       '200':
 *         description: Successful response with missing board list.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       '500':
 *         description: Internal server error occurred.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /monthlyShifts/{organization}:
 *   get:
 *     summary: Get shifts by organization
 *     tags: [Monthly Shift]
 *     description: Retrieve the shifts for a specified organization.
 *     parameters:
 *       - in: path
 *         name: organization
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the organization to retrieve shifts for.
 *     responses:
 *       '200':
 *         description: Successful response with shifts data.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       '500':
 *         description: Internal server error occurred.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /monthlyShifts/monthOpendToAddShiftsList/{organization}:
 *   get:
 *     summary: Get month and year list for monthly shifts
 *     tags: [Monthly Shift]
 *     description: Retrieve the month and year list for monthly shifts.
 *     parameters:
 *       - in: path
 *         name: organization
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the organization to retrieve the month and year list for.
 *     responses:
 *       '200':
 *         description: Successful response with month and year list.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       '500':
 *         description: Internal server error occurred.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /monthlyShifts:
 *   post:
 *     summary: Add a new monthly shift
 *     tags: [Monthly Shift]
 *     description: Add a new monthly shift.
 *     requestBody:
 *       description: New shift details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               property1:
 *                 type: string
 *                 description: Property 1 description
 *               property2:
 *                 type: string
 *                 description: Property 2 description
 *             example:
 *               property1: value1
 *               property2: value2
 *     responses:
 *       '200':
 *         description: Successful response with success message.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       '500':
 *         description: Internal server error occurred.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /monthlyShifts/createMonthlyShiftBoard:
 *   post:
 *     summary: Create monthly shift board
 *     tags: [Monthly Shift]
 *     description: Create monthly shift board.
 *     requestBody:
 *       description: Request body
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               property1:
 *                 type: string
 *                 description: Property 1 description
 *               property2:
 *                 type: string
 *                 description: Property 2 description
 *             example:
 *               property1: value1
 *               property2: value2
 *     responses:
 *       '200':
 *         description: Successful response with monthly shift board data.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       '500':
 *         description: Internal server error occurred.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /monthlyShifts/{id}:
 *   delete:
 *     summary: Delete a monthly shift
 *     tags: [Monthly Shift]
 *     description: Delete a monthly shift by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the monthly shift to delete.
 *     responses:
 *       '200':
 *         description: Successful response with success message.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       '404':
 *         description: Monthly shift not found.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /monthlyShifts/published/{organization}:
 *   get:
 *     summary: Get published shifts by organization
 *     tags: [Monthly Shift]
 *     description: Retrieve the published shifts for a specified organization.
 *     parameters:
 *       - in: path
 *         name: organization
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the organization to retrieve published shifts for.
 *     responses:
 *       '200':
 *         description: Successful response with published shifts data.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       '500':
 *         description: Internal server error occurred.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /monthlyShifts/openToConstraints/{organization}:
 *   get:
 *     summary: Get shifts open to constraints by organization
 *     tags: [Monthly Shift]
 *     description: Retrieve the shifts that are open to constraints for a specified organization.
 *     parameters:
 *       - in: path
 *         name: organization
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the organization to retrieve shifts for.
 *     responses:
 *       '200':
 *         description: Successful response with shifts data.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       '500':
 *         description: Internal server error occurred.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /monthlyShifts/openToConstraintsByRoles/{organization}/{role_types}:
 *   get:
 *     summary: Get shifts open to constraints by roles and organization
 *     tags: [Monthly Shift]
 *     description: Retrieve the shifts that are open to constraints for the specified roles and organization.
 *     parameters:
 *       - in: path
 *         name: organization
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the organization to retrieve shifts for.
 *       - in: path
 *         name: role_types
 *         required: true
 *         schema:
 *           type: string
 *         description: The role types to filter shifts by.
 *     responses:
 *       '200':
 *         description: Successful response with shifts data.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       '500':
 *         description: Internal server error occurred.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /monthlyShifts/byId/{id}:
 *   get:
 *     summary: Get a monthly shift by ID
 *     tags: [Monthly Shift]
 *     description: Retrieve a monthly shift by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the monthly shift to retrieve.
 *     responses:
 *       '200':
 *         description: Successful response with monthly shift data.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       '500':
 *         description: Internal server error occurred.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /monthly-shifts/assingEmployees/{id}:
 *   patch:
 *     summary: Change employees in a monthly shift
 *     tags: [Monthly Shift]
 *     description: Change employees in a monthly shift by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the monthly shift to update.
 *     requestBody:
 *       description: Request body
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               roles: [role1, role2]
 *     responses:
 *       '200':
 *         description: Successful response with success message.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       '500':
 *         description: Internal server error occurred.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /monthly-shifts/ShiftsByRoleType/{roleType}/{startTime}:
 *   get:
 *     summary: Get shifts by role type and start time
 *     tags: [Monthly Shift]
 *     description: Retrieve the shifts for the specified role type and start time.
 *     parameters:
 *       - in: path
 *         name: roleType
 *         required: true
 *         schema:
 *           type: string
 *         description: The role type to filter shifts by.
 *       - in: path
 *         name: startTime
 *         required: true
 *         schema:
 *           type: string
 *         description: The start time to filter shifts by.
 *     responses:
 *       '200':
 *         description: Successful response with shifts data.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       '500':
 *         description: Internal server error occurred.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /monthly-shifts/generateScheduleMonthlyShifts/{month}/{year}:
 *   post:
 *     summary: Generate schedule for monthly shifts
 *     tags: [Monthly Shift]
 *     description: Generate schedule for monthly shifts based on the specified month and year.
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *         description: The month to generate the schedule for.
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *         description: The year to generate the schedule for.
 *     requestBody:
 *       description: Request body
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               property1:
 *                 type: string
 *                 description: Property 1 description
 *               property2:
 *                 type: string
 *                 description: Property 2 description
 *             example:
 *               property1: value1
 *               property2: value2
 *     responses:
 *       '200':
 *         description: Successful response with generated schedule data.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       '500':
 *         description: Internal server error occurred.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MonthlyShift:
 *       type: object
 *       properties:
 *         organization:
 *           type: string
 *           description: The organization of the monthly shift.
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: The start time of the monthly shift.
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: The end time of the monthly shift.
 *         name:
 *           type: string
 *           description: The name of the monthly shift.
 *         roles:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               roleType:
 *                 type: string
 *                 description: The role type of the shift.
 *               amount:
 *                 type: number
 *                 description: The amount of employees needed for the role.
 *               employeeIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The IDs of the employees assigned to the role.
 */


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

router.get("/byId/:id", middleware, async (req, res) => {
  try {
    const id = req.params.id;
    const shifts = await getShiftById(id);
    res.send(shifts);
  } catch (err) {
    res.send("error occured to get shifts: " + err);
  }
});

router.patch("/assingEmployees/:id", middleware, async (req, res) => {
  try {
    const result = await changeEmployeesInShift(req.params.id, req.body.roles);
    res.send(result);
  } catch (err) {
    res.send(
      "failed to update employees in shift " + req.params.id + " error: " + err
    );
  }
});

router.get(
  "/ShiftsByRoleType/:roleType/:startTime",
  middleware,
  async (req, res) => {
    try {
      const roleType = req.params.roleType;
      const startTime = req.params.startTime;
      const shifts = await ShiftsByRoleType(roleType, startTime);
      res.send(shifts);
    } catch (err) {
      res.send("error occured to get shifts: " + err);
    }
  }
);
router.post(
  "/generateScheduleMonthlyShifts/:month/:year",
  middleware,
  async (req, res) => {
    try {
      const shifts = await generateScheduleMonthlyShifts(req);
      res.send(shifts);
    } catch (err) {
      res.send("error occured to get shifts: " + err);
    }
  }
);

module.exports = router;
