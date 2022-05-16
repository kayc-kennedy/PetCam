const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UsersRepository = require('../repositories/UsersRepository');
require('dotenv').config()

module.exports = {
    loginUser: async (data) => {
        const { nome_usuario, password, tipo_usuario } = data
        try {

            const response = await UsersRepository.getUserByNameUser({ nome_usuario, tipo_usuario });
            const passwordCheck = bcrypt.compareSync(password.toString(), response.senha)
            
            if (!passwordCheck) {
                return { "message": "Senha incorreta", "status_code": 403 }
            }
            return {  id: response.id_cliente || response.id_petshop, 
                      nome: response.nome, 
                      tipo_usuario: response.tipo_usuario,
                      "token": createJWT(response.id_cliente || response.id_petshop), 
                      "status_code": 200,
                      "message": "Login efetuado com sucesso" }

        } catch (error) {
            return { "message": "Erro no banco de dados", "status_code": 422 }
        }
    },

    registerUser: async (data) => {
        const { password, nome_usuario, tipo_usuario = 'C', nome, status = 'A', email  } = data

        try {
            const response = await UsersRepository.registerUser({ senha: bcrypt.hashSync(password, 10), nome_usuario, tipo_usuario}, {nome, status, email});

            if(response.errno == 1062) return { "message": "Usuário existente no sistema", "status_code": 422 }
            return { "message": "Usuário criado com sucesso", "token": createJWT(response.id_usuario), "status_code": 201 }

        } catch (error) {
            return { "message": "Erro ao realizar cadastro", "status_code": 422 }
        }
    }
}

function createJWT(id_usuario) {
    return jwt.sign({ id_usuario }, process.env.SECRET, { expiresIn: '30m' })
}
