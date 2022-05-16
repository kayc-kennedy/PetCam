const jwt = require('jsonwebtoken');
require('dotenv').config()
module.exports = {
    validateToken(req, res, next) {
        if(!req.headers['authorization']){
            return res.status(401).json({ message: 'Nenhum token informado.' });
        }
        const bearer = req.headers['authorization'];
        const token = bearer.split(" ")
        if (!token[1]) return res.status(401).json({ message: 'Nenhum token informado.' });

        jwt.verify(token[1], process.env.SECRET, function (err, decoded) {
            if (err) return res.status(500).json({ message: 'Token inválido.' });
            req.idLogado = decoded.id_usuario
            next();
        });
    }
}
