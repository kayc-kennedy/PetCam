const jwt = require('jsonwebtoken');
const permission = require('../services/AuthService')

require('dotenv').config()

module.exports = {
    async validatePermission(req, res, next) {
        const havePermission = await permission.validatePermission(req.idLogado)
        
        if (!havePermission) return res.status(403).json({ message: 'Token inválido.' });
        return next();

    }
}
