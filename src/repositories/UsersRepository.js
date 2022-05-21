const db = require('../db')

module.exports = {
    getUserByNameUser: async (nome_usuario, tipo_usuario) => {
        try {
            if(tipo_usuario == 'C'){    
                const response = await db('usuario')
                    .join('cliente', 'usuario.id_usuario', '=', "cliente.id_usuario")
                    .select('cliente.id_cliente', 'cliente.nome', 'cliente.status', 'usuario.senha', 'usuario.tipo_usuario')
                    .where({'usuario.nome_usuario': nome_usuario, 'usuario.tipo_usuario': tipo_usuario, 'cliente.status': 'A'})
                    
                return response[0]
            }
            const response = await db('usuario')
                .join('petshop', 'usuario.id_usuario', '=', "petshop.id_usuario")
                .select('petshop.id_petshop', 'petshop.nome', 'petshop.status', 'usuario.senha', 'usuario.tipo_usuario')
                .where({'usuario.nome_usuario': nome_usuario, 'usuario.tipo_usuario': tipo_usuario, 'petshop.status': 'A'})

            return response[0]
            
        } catch (error) {
            return error;
        }
    },
    updateProfile: async (id_cliente, user, client) => {
        try {
            var responseUser;
            var responseClient;
            var dataClient;
            
            let nome = client.nome;
            let email = client.email

            // Busca informação do cliente
            dataClient = await 
                db('cliente')
                    .select('cliente.nome', 'cliente.email')
                    .where({'cliente.id_cliente':id_cliente});
            
            
            // Persiste as informações do cliente, para que não seja possivel atualizar para null no banco
            if(!nome || !email){
                nome = dataClient[0].nome
                email = dataClient[0].email

            }
            // Se existir senha, atualizo
            if(user.senha){
                responseUser = await 
                db('usuario')
                    .join('cliente', 'cliente.id_usuario', '=', 'usuario.id_usuario')
                    .where({'cliente.id_cliente':id_cliente})
                    .update({'senha': user.senha})

                if(responseUser){
                    responseClient = await 
                    db('cliente')
                        .where({'cliente.id_cliente':id_cliente})
                        .update({'nome':nome, 'email':email})
                }

                if(responseUser && responseClient) return true
            }
            // se a senha tiver vazia, atualizo somente os campos nome e email
            responseClient = await 
            db('cliente')
                .where({'cliente.id_cliente':id_cliente})
                .update({'nome':nome, 'email':email})
            if(responseClient) return true

            return false;

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
        if(id){
            const response = await db('petshop')
            .select('petshop.id_petshop')
            .where({'id_petshop': id, 'status': 'A'})
            
            return (response[0].id_petshop ? true:false)
        }
        return false;
    }
}