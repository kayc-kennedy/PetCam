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

exports.insertCamera = async (req, res) => {
    const service = await CameraService.insertCamera(req.body);
        return res.status(service.status_code).json(service);
}

exports.blockAcessClient = async (req, res) => {
    const service = await CameraService.blockAcessClient(req.params);
        return res.status(service.status_code).json(service);
}

exports.changeStatusCamera = async (req, res) => {
    const service = await CameraService.changeStatusCamera(req.body);
        return res.status(service.status_code).json(service);
}

exports.getCamerasAvailable = async (req, res) => {
    const service = await CameraService.getCamerasAvailable(req.params);
        return res.status(service.status_code).json(service.response);
}


