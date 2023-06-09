const express = require("express");
const {
  swapEmployeesInShift,
  createSwapRequest,
} = require("../controllers/swapRequests");
const middleware = require("../common/auth_middleware");
var router = express.Router();

/**
 * @swagger
 * tags:
 *   name: SwapRequests
 *   description: API endpoints for managing swap requests
 */

/**
 * @swagger
 * /swapRequests/create:
 *   post:
 *     summary: Create a new swap request
 *     tags: [SwapRequests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               requestUserId:
 *                 type: string
 *               shiftId:
 *                 type: string
 *               requestShiftId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response indicating the created swap request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SwapRequest'
 *       403:
 *         description: Users are not in the same organization
 *       404:
 *         description: Target user, target shift, or requested shift not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /swapRequests/switchShifts:
 *   post:
 *     summary: Switch employees in two shifts based on a swap request
 *     tags: [SwapRequests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               swapRequestId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response indicating that shifts were switched
 *       500:
 *          description: Shift is already swapped or error switching shifts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SwapRequest:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *         shiftId:
 *           type: string
 *         requestUserId:
 *           type: string
 *         requestShiftId:
 *           type: string
 *         status:
 *           type: string
 *           enum: ['requested', 'approved', 'rejected']
 */

router.post("/create", middleware, createSwapRequest);
router.post("/switchShifts", middleware, swapEmployeesInShift);

module.exports = router;
