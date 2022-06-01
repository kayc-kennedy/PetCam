const db = require('../db')

module.exports = {
    registerPet: async (data) => {
        try {
            const response = await db('animal').insert(data)
            return response

        } catch (error) { 
            return error;
        }
    },
    getListAcess: async (id_petshop) => {
        try {
            const response = await db('acesso_camera')
            .join('animal', 'animal.id_animal', '=', 'acesso_camera.id_animal')
            .join('cliente', 'cliente.id_cliente', '=', 'animal.id_cliente')
            .select('animal.id_cliente', 'acesso_camera.id_animal', 'cliente.nome as nome_cliente', 'animal.nome as nome_animal')
            .where({'acesso_camera.status':'A', 'acesso_camera.id_petshop':id_petshop})

            return response;

        } catch (error) { 
            return error;
        }
    },
    
    getClients: async (id_petshop) => {
        try {

            const response = await db('cliente')
            .select('cliente.id_cliente', 'cliente.id_usuario', 'cliente.nome', 'cliente.email', 'cliente.status')
            .where({"cliente.status":'A', 'cliente.id_petshop':id_petshop})
            .groupBy('cliente.id_cliente', 'cliente.id_usuario', 'cliente.nome', 'cliente.email')

            return response;

        } catch (error) { 
            return error;
        }
    },
    getPets: async (idCliente) => {
        try {

            const response = await db('animal')
            .join('cliente', "cliente.id_cliente", '=', 'animal.id_cliente')
            .select('animal.id_animal', 'animal.nome', )
            .where({'cliente.status': 'A', 'animal.status': 'A', 'animal.id_cliente':idCliente})
            
            return response;

        } catch (error) { 
            return error;
        }
    }
}