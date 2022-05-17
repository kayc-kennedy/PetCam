const express = require('express');
const router = express.Router();
const CameraController = require('../controllers/CameraController');
const {validateToken} = require('../middleware/validadeToken')
const {validatePermission} = require('../middleware/validatePermission')

// CAMERA
router.get('/listall/:id_petshop', [validateToken, validatePermission], CameraController.getAllCameras);
router.post('/grant-acess/:id_petshop/:id_animal/:id_cliente', [validateToken, validatePermission], CameraController.insertGrantAcess);




module.exports = router;