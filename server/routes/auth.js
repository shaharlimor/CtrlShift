var express = require('express');
const authController = require('../controllers/auth');
const middleware = require('../common/auth_middleware');
var router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refreshToken', authController.refreshToken);

// With middleware
router.post('/logout', middleware, authController.logout);
router.get('/getUserByRefreshToken', authController.getUserByRefreshToken);


module.exports = router;
