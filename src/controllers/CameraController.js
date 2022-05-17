const CameraService = require('../services/CameraService')
require('dotenv').config()

exports.getAllCameras = async (req, res) => {
    const service = await CameraService.getAllCameras(req.params.id_petshop);
        return res.status(service.status_code).json(service.response);
}

exports.insertGrantAcess = async (req, res) => {
    const service = await CameraService.insertGrantAcess(req.params);
        return res.status(service.status_code).json(service);
}

