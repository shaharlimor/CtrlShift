var express = require('express');
const authController = require('../controllers/auth');
const middleware = require('../common/auth_middleware');
var router = express.Router();

router.post('/login', authController.login);
router.get('/register', authController.register);
router.get('/refreshToken', authController.refreshToken);

// With middleware
router.get('/logout', middleware, authController.logout);


module.exports = router;
