const AuthService = require('../services/AuthService')
require('dotenv').config()

exports.insert = async (req, res) => {
    const service = await AuthService.registerUser(req.body)

        return res.status(service.status_code).json(service);
}

exports.login = async (req, res) => {
    const service = await AuthService.loginUser(req.body)
        return res.status(service.status_code).json(service);
}

exports.updateProfile = async (req, res) => {
    const service = await AuthService.updateProfile(req.body)
        return res.status(service.status_code).json(service);
}

exports.getIdUserByNameUser = async (req, res) => {
    const service = await AuthService.getIdUserByNameUser(req.params)
        return res.status(service.status_code).json(service || service.message);
}


