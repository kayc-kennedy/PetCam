const PetshopService = require('../services/PetshopService')
require('dotenv').config()

exports.insert = async (req, res) => {
    const response = await PetshopService.registerPet(req.body)
        return res.status(response.status_code).json(response);
}
