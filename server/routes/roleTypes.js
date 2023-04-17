const express = require("express");
const { getRoleTypes, createRole, deleteRole, updateRole} = require("../controllers/roleTypes");
const middleware = require('../common/auth_middleware');
var router = express.Router();

router.get('/:orgId', middleware, getRoleTypes);
router.post('/create', middleware, createRole);
router.post('/delete', middleware, deleteRole);
router.post('/update', middleware, updateRole);

module.exports = router;
