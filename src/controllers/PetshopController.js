const PetshopService = require('../services/PetshopService')
require('dotenv').config()

exports.insertPets = async (req, res) => {
    const service = await PetshopService.registerPet(req.body)
        return res.status(service.status_code).json(service);
}

exports.getClients = async (req, res) => {
    const service = await PetshopService.getClients()
        return res.status(service.status_code).json(service.response);
}

exports.getPets = async (req, res) => {
    const service = await PetshopService.getPets(req.params.idcliente)
        return res.status(service.status_code).json(service.response);
}

exports.getListAcess = async (req, res) => {
    const service = await PetshopService.getListAcess(req.params)
        return res.status(service.status_code).json(service.response);
}

