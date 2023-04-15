const express = require("express");
const { getShifts, updatePermanentShift, deletePermanentShift, createPermanentShift } = require("../controllers/permanentShifts");
const middleware = require('../common/auth_middleware');
var router = express.Router();

router.get('/:orgId', middleware, getShifts);
router.post('/create', middleware, createPermanentShift);
router.post('/delete', middleware, deletePermanentShift);
router.post('/update', middleware, updatePermanentShift);

module.exports = router;
