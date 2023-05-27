const express = require("express");
const {swapEmployeesInShift, createSwapRequest } = require("../controllers/swapRequests");
const middleware = require('../common/auth_middleware');
var router = express.Router();

router.post('/create', middleware, createSwapRequest);
router.post('/switchShifts', middleware, swapEmployeesInShift);


module.exports = router;