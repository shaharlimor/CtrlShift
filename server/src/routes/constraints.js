const express = require("express");
const Constraint = require("../models/constraints");
const middleware = require("../common/auth_middleware");
const {
  getConstraints,
  getConstraintsByShiftId,
  getConstraintsByEmployeeId,
  employeeHasConstraintInShift,
  getEmployeesWithConstarintsInShift,
} = require("../controllers/constraints");
const user = require("../models/user");

var router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Constraints
 *   description: API endpoints for managing constraints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Constraints:
 *       type: object
 *       properties:
 *         level:
 *           type: string
 *           description: The level of the constraint.
 *         description:
 *           type: string
 *           description: The description of the constraint.
 *         shiftId:
 *           type: string
 *           description: The ID of the shift associated with the constraint.
 *         employeeId:
 *           type: string
 *           description: The ID of the employee associated with the constraint.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Employees:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The ID of the employee.
 *         firstName:
 *           type: string
 *           description: The first name of the employee.
 *         lastName:
 *           type: string
 *           description: The last name of the employee.
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the employee.
 *         phone:
 *           type: string
 *           description: The phone number of the employee.
 *         password:
 *           type: string
 *           format: password
 *           description: The password of the employee.
 *         organization:
 *           type: string
 *           description: The organization the employee belongs to.
 *         role_types:
 *           type: array
 *           items:
 *             type: string
 *           description: The role types assigned to the employee.
 *         isAdmin:
 *           type: boolean
 *           description: Indicates if the employee is an admin.
 *         tokens:
 *           type: array
 *           items:
 *             type: string
 *           description: The authentication tokens associated with the employee.
 */

/**
 * 
/**
 * @swagger
 * /constraints/{organization}:
 *   get:
 *     summary: Get constraints for a specific organization
 *     tags: [Constraints]
 *     description: Retrieve the constraints for a specified organization.
 *     parameters:
 *       - in: path
 *         name: organization
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the organization to retrieve constraints for.
 *     responses:
 *       '200':
 *         description: Successful response with constraints data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Constraints'
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
 * /constraints/byShift/{id}:
 *   get:
 *     summary: Get constraints by shift ID
 *     description: Retrieve constraints based on the specified shift ID.
 *     tags: [Constraints]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the shift.
 *     responses:
 *       '200':
 *         description: Successful response with constraints data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Constraints'
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
 * /constraints/byEmployee/{id}:
 *   get:
 *     summary: Get constraints by employee ID
 *     description: Retrieve constraints based on the specified employee ID.
 *     tags: [Constraints]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the employee.
 *     responses:
 *       '200':
 *         description: Successful response with constraints data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Constraints'
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
 * /constraints/userHasConstraint/{employeeId}/{shiftId}:
 *   get:
 *     summary: Check if an employee has a constraint in a shift
 *     description: Check if the specified employee has a constraint in the specified shift.
 *     tags: [Constraints]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the employee.
 *       - in: path
 *         name: shiftId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the shift.
 *     responses:
 *       '200':
 *         description: Successful response indicating if the employee has a constraint.
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
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
 * /constraints/EmployeesWithConstraintInShift/{id}:
 *   get:
 *     summary: Get employees with constraints in a shift
 *     description: Retrieve employees who have constraints in the specified shift.
 *     tags: [Constraints]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the shift.
 *     responses:
 *       '200':
 *         description: Successful response with employees data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employees'
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
 * /constraints:
 *   post:
 *     summary: Add a new constraint
 *     description: Create a new constraint.
 *     tags: [Constraints]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Constraint'
 *     responses:
 *       '200':
 *         description: Successful response indicating the successful addition of the constraint.
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


 router.get("/:organization", middleware, async (req, res) => {
  try {
    const organization = req.params.organization;
    const constraints = await getConstraints(organization);
    res.send(constraints);
  } catch (err) {
    res.send("error occurred to get constraints: " + err);
  }
});


router.get("/:organization", middleware, async (req, res) => {
  try {
    const organization = req.params.organization;
    const constraints = await getConstraints(organization);
    res.send(constraints);
  } catch (err) {
    res.send("error occurred to get constraints: " + err);
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

router.get(
  "/EmployeesWithConstraintInShift/:id",
  middleware,
  async (req, res) => {
    try {
      const shiftID = req.params.id;
      const employess = await getEmployeesWithConstarintsInShift(shiftID);
      res.send(employess);
    } catch (err) {
      res.send(err);
    }
  }
);

router.post(
  "/delete",
  middleware,
  async (req, res) => {
    try {
      const shiftId = req.body.shiftId;
      const employeeId = req.body.employeeId;
      await Constraint.findOneAndDelete(
        { shiftId: shiftId,
         employeeId: employeeId }
    );
    res.status(200).json({ message: 'Constraint deleted successfully'});
    } catch (err) {
      res.status(500).json({ message: 'Error deleting constraint' });
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
