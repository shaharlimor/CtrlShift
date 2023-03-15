var express = require('express');
const authController = require('../controllers/auth');
const middleware = require('../common/auth_middleware');
var router = express.Router();

router.get('/login', (req, res) => {
    authController.login().then(users => {
        // res.send(users);
    }).catch(error => {
        res.status(500).send({error: error.message});
    });
});

router.get('/register', (req, res) => {
    authController.register()
    .catch(error => {
        res.status(500).send({error: error.message});
    });
});

router.get('/refreshToken', (req, res) => {
    authController.refreshToken()
    .catch(error => {
        res.status(500).send({error: error.message});
    });
});

// With middleware
router.get('/logout', middleware, (req, res) => {
    authController.logout()
    .catch(error => {
        res.status(500).send({error: error.message});
    });
});



module.exports = router;
