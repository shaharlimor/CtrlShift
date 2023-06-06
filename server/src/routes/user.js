const express = require("express");
const userController = require("../controllers/user");
const middleware = require("../common/auth_middleware");
const multer = require("multer");
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024, // 500 KB
  },
});

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API endpoints for user operations
 */

/**
 * @swagger
 * /user/delete/{id}:
 *   post:
 *     summary: Delete a user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '500':
 *         description: Error deleting user
 */
router.post("/delete/:id", middleware, userController.deleteUser);

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateRequest'
 *     responses:
 *       '200':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '500':
 *         description: Error creating user details
 */
router.post("/create", middleware, userController.createUser);

/**
 * @swagger
 * /user/update:
 *   post:
 *     summary: Update an existing user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateRequest'
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '500':
 *         description: Error updating user details
 */
router.post("/update", middleware, userController.updateUser);

/**
 * @swagger
 * /user/users:
 *   get:
 *     summary: Get all users by organization
 *     tags: [User]
 *     responses:
 *       '200':
 *         description: All users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponse'
 *       '500':
 *         description: Error getting all users
 */
router.get("/users", middleware, userController.getAllUsersByOrganization);

/**
 * @swagger
 * /user/changeImage:
 *   post:
 *     summary: Change user image
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *       '500':
 *         description: Error uploading image
 */
router.post(
  "/changeImage",
  middleware,
  upload.single("image"),
  userController.changeImage
);

/**
 * @swagger
 * /user/changePassword:
 *   post:
 *     summary: Change user password
 *     tags: [User]
 *     requestBody
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       '200':
 *         description: Password changed successfully
 *       '400':
 *         description: Current password is incorrect
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Error changing password
 */
router.post("/changePassword", middleware, userController.changePassword);

/**
 * @swagger
 * /user/getEmployeesDetails/{ids}:
 *   get:
 *     summary: Get details of multiple employees
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: ids
 *         required: true
 *         description: Comma-separated IDs of the employees
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Employee details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EmployeeDetailsResponse'
 *       '500':
 *         description: Error with getting employee details
 */
router.get(
  "/getEmployeesDetails/:ids",
  middleware,
  userController.getEmployeesDetails
);

module.exports = router;
