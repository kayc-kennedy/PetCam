const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UsersRepository = require('../repositories/UsersRepository');
require('dotenv').config()

module.exports = {
    loginUser: async (data) => {
        const { nome_usuario, password, tipo_usuario } = data
        try {

            const response = await UsersRepository.getUserByNameUser( nome_usuario, tipo_usuario );
            
            if(!response){
                return { "message": "Usuário inexistente", "status_code": 404 }
            }
            
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
            console.log(error)
            return { "message": "Erro no banco de dados", "status_code": 422 }
        }
    },

    registerUser: async (data) => {
        const { password, nome_usuario, tipo_usuario = 'C', nome, status = 'A', email  } = data

        try {
            const response = await UsersRepository.registerUser({ senha: bcrypt.hashSync(password, 10), nome_usuario, tipo_usuario}, {nome, status, email});
            console.log(response)
            if(response.errno == 1062) return { "message": "Usuário existente no sistema", "status_code": 422 }
            return { "message": "Usuário criado com sucesso", "token": createJWT(response.id_usuario), "status_code": 201 }

        } catch (error) {
            return { "message": "Erro ao realizar cadastro", "status_code": 422 }
        }
    },

    validatePermission: async (id) =>{
        try{
            const response = await UsersRepository.validatePermission(id);
            return response;
            
        }catch(error){
            return error;
        }
    },
    updateProfile: async (data) => {
        const { id_cliente,  password, nome, email  } = data

        var passwordEncrypted; 
        var response;
        try {
            if(password) {
                passwordEncrypted = bcrypt.hashSync(password, 10)
                response = await UsersRepository.updateProfile(id_cliente, {senha: passwordEncrypted}, {nome, email});
 
                if(response) return { "message": "Usuário alterado com sucesso",  "status_code": 200 }
            }

            response = await UsersRepository.updateProfile(id_cliente, {senha: ""}, {nome, email});
            if(response) return { "message": "Usuário alterado com sucesso",  "status_code": 200 }

            return { "message": "Usuário não encontrado",  "status_code": 404 }

        } catch (error) {
            return { "message": "Erro ao realizar cadastro", "status_code": 422 }
        }
    },
    getUserByNameUser: async (data) => {
        const { nome_usuario, tipo_usuario = 'C'  } = data

        try {
            if(nome_usuario && nome_usuario != '' && nome_usuario != undefined) {
                response = await UsersRepository.getUserByNameUser(nome_usuario, tipo_usuario);
 
                if(response) return { response, "status_code": 200 }

                return { "message":"Usuário não encontrado", "status_code":404 }
            }
            return { "message":"Informe um usuário válido", "status_code":400 }

        } catch (error) {
            console.log(error)
            return { "message": "Erro ao buscar usuário", "status_code": 422 }
        }
    }
}

function createJWT(id_usuario) {
    return jwt.sign({ id_usuario }, process.env.SECRET, { expiresIn: '60m' })
}
