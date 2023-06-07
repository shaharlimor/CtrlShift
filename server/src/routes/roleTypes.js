const express = require("express");
const roleTypesController = require("../controllers/roleTypes");
const middleware = require("../common/auth_middleware");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: roleTypes
 *   description: API endpoints for managing roleTypes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ShiftRoles:
 *       type: object
 *       properties:
 *         organization:
 *           type: string
 *         roleType:
 *           type: string
 */

/**
 * @swagger
 * /roleTypes/{orgId}:
 *   get:
 *     summary: Get role types by organization ID
 *     tags: [roleTypes]
 *     parameters:
 *       - in: path
 *         name: orgId
 *         description: ID of the organization
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: Role types retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShiftRoles'
 *       '500':
 *         description: Error occurred while retrieving role types
 */
router.get("/:orgId", middleware, roleTypesController.getRoleTypes);

/**
 * @swagger
 * /roleTypes/create:
 *   post:
 *     summary: Create a new role
 *     tags: [roleTypes]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShiftRoles'
 *     responses:
 *       '200':
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShiftRoles'
 *       '500':
 *         description: Error occurred while creating a role
 */
router.post("/create", middleware, roleTypesController.createRole);

/**
 * @swagger
 * /roleTypes/delete:
 *   post:
 *     summary: Delete a role
 *     tags: [roleTypes]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Role deleted successfully
 *       '404':
 *         description: Role not found
 *       '500':
 *         description: Error occurred while deleting a role
 */
router.post("/delete", middleware, roleTypesController.deleteRole);

/**
 * @swagger
 * /roleTypes/update:
 *   post:
 *     summary: Update a role
 *     tags: [roleTypes]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShiftRoles'
 *     responses:
 *       '200':
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShiftRoles'
 *       '404':
 *         description: Role not found
 *       '500':
 *         description: Error occurred while updating a role
 */
router.post("/update", middleware, roleTypesController.updateRole);

module.exports = router;
