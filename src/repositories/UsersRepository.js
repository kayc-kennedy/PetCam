const db = require('../db')

module.exports = {
    registerUser: async (user, data) => {
        try {
            const response = await db('usuario').insert(user)
                      
            if(response[0] > 0 ){ // Verifico se o usuário foi criado
                const id_usuario = response[0];
                const dados_cadastrais = {id_usuario:id_usuario, nome:data.nome, email:data.email, status:data.status}

                if(user.tipo_usuario == "C"){ // Cadastrar cliente
                    const response_client = await db('cliente').insert(dados_cadastrais)
                    return response_client
                }

                // Cadastrar Petshop
                const response_petshop = await db('petshop').insert(dados_cadastrais)
                return response_petshop
            }

        } catch (error) { 
            console.log(error)
            return error;
        }
    }
}