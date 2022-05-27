const express = require('express');
const router = express.Router();
const CameraController = require('../controllers/CameraController');
const {validateToken} = require('../middleware/validadeToken')
const {validatePermission} = require('../middleware/validatePermission')

// CAMERA
router.get('/listall/:id_petshop', [validateToken, validatePermission], CameraController.getAllCameras);
router.get('/list/:id_cliente', [validateToken], CameraController.getCamerasAvailable);

router.post('/grant-acess/:id_petshop/:id_animal/:id_cliente', [validateToken, validatePermission], CameraController.insertGrantAcess);

router.put('/block-acess/:id_petshop/:id_animal/', [validateToken, validatePermission], CameraController.blockAcessClient);
router.put('/change-status/', [validateToken, validatePermission], CameraController.changeStatusCamera);

module.exports = router;