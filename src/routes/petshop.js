const express = require('express');
const router = express.Router();
const PetshopController = require('../controllers/PetshopController');
const {validateToken} = require('../middleware')

// PETSHOP
router.post('/pet', validateToken, PetshopController.insert);



module.exports = router;