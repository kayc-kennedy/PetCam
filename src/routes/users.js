const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');
const {validateToken} = require('../middleware')

// AUTH
router.post('/signup', validateToken, UsersController.insert);
router.post('/login', UsersController.login);



module.exports = router;