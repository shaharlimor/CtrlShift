const express = require("express");
const {
  getShifts,
  updatePermanentShift,
  deletePermanentShift,
  createPermanentShift,
} = require("../controllers/permanentShifts");
const middleware = require("../common/auth_middleware");
var router = express.Router();

/**
 * @swagger
 * tags:
 *   name: PermanentShifts
 *   description: API endpoints for managing permanent shifts
 */

/**
 * @swagger
 * /permanentShifts/{orgId}:
 *   get:
 *     summary: Get shifts for a specific organization
 *     tags: [PermanentShifts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the organization
 *     responses:
 *       200:
 *         description: Successful response with the shifts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PermanentShift'
 *       500:
 *         description: Internal server error

 * /permanentShifts/create:
 *   post:
 *     summary: Create a new permanent shift
 *     tags: [PermanentShifts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PermanentShift'
 *     responses:
 *       200:
 *         description: Successful response indicating the created shift
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PermanentShift'
 *       500:
 *         description: Internal server error

 * /permanentShifts/delete:
 *   post:
 *     summary: Delete a permanent shift
 *     tags: [PermanentShifts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the shift to delete
 *     responses:
 *       200:
 *         description: Successful response indicating the deleted shift
 *       500:
 *         description: Internal server error

 * /permanentShifts/update:
 *   post:
 *     summary: Update a permanent shift
 *     tags: [PermanentShifts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PermanentShift'
 *     responses:
 *       200:
 *         description: Successful response indicating the updated shift
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PermanentShift'
 *       404:
 *         description: Shift not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PermanentShift:
 *       type: object
 *       properties:
 *         organization:
 *           type: string
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         days:
 *           type: array
 *           items:
 *             type: string
 *         name:
 *           type: string
 *         roles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ShiftRole'
 *
 *     ShiftRole:
 *       type: object
 *
 *       properties:
 *         roleType:
 *           type: string
 *         amount:
 *           type: number
 */

router.get("/:orgId", middleware, getShifts);
router.post("/create", middleware, createPermanentShift);
router.post("/delete", middleware, deletePermanentShift);
router.post("/update", middleware, updatePermanentShift);

module.exports = router;
