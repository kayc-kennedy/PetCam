const express = require('express');
const router = express.Router();
const PetshopController = require('../controllers/PetshopController');
const {validateToken} = require('../middleware/validadeToken')
const {validatePermission} = require('../middleware/validatePermission')

// PETSHOP
router.post('/pet', [validateToken, validatePermission], PetshopController.insertPets);
router.get('/clients/:id_petshop', [validateToken, validatePermission], PetshopController.getClients);
router.get('/pets/:idcliente', [validateToken, validatePermission], PetshopController.getPets);
router.get('/list_acess/:id_petshop', [validateToken, validatePermission], PetshopController.getListAcess);




module.exports = router;