const express = require("express");
const shiftRoleController = require("../controllers/shiftRoles");
const middleware = require('../common/auth_middleware');
var router = express.Router();

router.get('/role', middleware, shiftRoleController.getRolesByOrganization);

module.exports = router;