const AuthService = require('../services/AuthService')
require('dotenv').config()

exports.insert = async (req, res) => {
    const response = await AuthService.registerUser(req.body)
        return res.status(response.status_code).json(response);
}