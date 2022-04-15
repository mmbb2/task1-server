const Router = require('express').Router;
const AuthController = require('../controllers/authController');
const TokenController = require('../controllers/tokenController');
const router = new Router();

router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/refresh', TokenController.refresh);
router.get('/test', TokenController.test);


module.exports = router;