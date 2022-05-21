const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');
const {validateToken} = require('../middleware/validadeToken');
const {validatePermission} = require('../middleware/validatePermission')


// AUTH
router.post('/signup', [validateToken, validatePermission], UsersController.insert);
router.post('/login', UsersController.login);
router.put('/update_profile', [validateToken], UsersController.updateProfile);





module.exports = router;