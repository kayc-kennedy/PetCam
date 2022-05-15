const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UsersRepository = require('../repositories/UsersRepository');
require('dotenv').config()

module.exports = {
    registerUser: async (data) => {
        const { password, nome_usuario, tipo_usuario = 'C', nome, status = 'A', email  } = data

        try {
            const response = await UsersRepository.registerUser({ senha: password, nome_usuario, tipo_usuario}, {nome, status, email});
            console.log(response)
            if(response.errno == 1062) return { "message": "Usuário existente no sistema", "status_code": 422 }
            return { "message": "Usuário criado com sucesso", "token": createJWT(response[0]), "status_code": 201 }

        } catch (error) {
            // console.log(error)
            return { "message": "Erro ao realizar cadastro", "status_code": 422 }
        }
    }
}

function createJWT(id) {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: '30m' })
}
