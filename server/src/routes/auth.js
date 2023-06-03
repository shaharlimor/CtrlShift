var express = require("express");
const authController = require("../controllers/auth");
const middleware = require("../common/auth_middleware");
var router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user authentication
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshTokenResponse'
 *       '401':
 *         description: Invalid credentials
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       '200':
 *         description: Successful registration
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshTokenResponse'
 *       '500':
 *         description: Registration failed
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/refreshToken:
 *   post:
 *     summary: Refresh token to generate a new access token
 *     tags: [Authentication]
 *     responses:
 *       '200':
 *         description: New access token generated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshTokenResponse'
 *       '403':
 *         description: Invalid request
 */
router.post("/refreshToken", authController.refreshToken);

/**
 * @swagger
 * /auth/updateUserDetails:
 *   post:
 *     summary: Update user details
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Error updating user details
 */
router.post(
  "/updateUserDetails",
  express.json(),
  authController.updateUserDetails
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 *     responses:
 *       '200':
 *         description: User logged out successfully
 *       '401':
 *         description: Unauthorized request
 *       '403':
 *         description: Invalid request
 */
router.post("/logout", middleware, authController.logout);

/**
 * @swagger
 * /auth/getUserByRefreshToken:
 *   get:
 *     summary: Get user details by refresh token
 *     tags: [Authentication]
 *     responses:
 *       '200':
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '500':
 *         description: Invalid token
 */
router.get("/getUserByRefreshToken", authController.getUserByRefreshToken);

module.exports = router;
