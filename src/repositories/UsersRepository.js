const db = require('../db')

module.exports = {
    getUserByNameUser: async (data) => {
        try {
            if(data.tipo_usuario == 'C'){    

                const response = await db('usuario')
                    .join('cliente', 'usuario.id_usuario', '=', "cliente.id_usuario")
                    .select('cliente.id_cliente', 'cliente.nome', 'cliente.status', 'usuario.senha', 'usuario.tipo_usuario')
                    .where({'usuario.nome_usuario': data.nome_usuario, 'usuario.tipo_usuario': data.tipo_usuario, 'cliente.status': 'A'})
                    // console.log(response[0])
                return response[0]
            }
            const response = await db('usuario')
                .join('petshop', 'usuario.id_usuario', '=', "petshop.id_usuario")
                .select('petshop.id_petshop', 'petshop.nome', 'petshop.status', 'usuario.senha', 'usuario.tipo_usuario')
                .where({'usuario.nome_usuario': data.nome_usuario, 'usuario.tipo_usuario': data.tipo_usuario, 'petshop.status': 'A'})

            return response[0]
            
        } catch (error) {
            return error;
        }
    },
      
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
            return error;
        }
    },

    validatePermission: async (id) => {
        console.log(id)
        if(id){
            const response = await db('petshop')
            .select('petshop.id_petshop')
            .where({'id_petshop': id, 'status': 'A'})
            
            return (response[0].id_petshop ? true:false)
        }
        return false;
    }
}