const express = require("express");
const userController = require("../controllers/users");
const middleware = require('../common/auth_middleware');
var router = express.Router();

router.post('/delete/:id', middleware, userController.deleteUser);
router.post('/create', middleware, userController.createUser);
router.post('/update/:id', middleware, userController.updateUser);


module.exports = router;