
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
require('dotenv').config()

router.get('/:id_usuario', (req, res)=> {
    const id_usuario = req.params.id_usuario
    return res.send(jwt.sign({ id_usuario }, process.env.SECRET, { expiresIn: '3000m' }))
})

module.exports = router

