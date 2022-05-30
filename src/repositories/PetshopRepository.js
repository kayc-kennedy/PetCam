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
    getClients: async () => {
        try {
            const response = await db.select().table('cliente').where("cliente.status", '=', 'A')
            return response;

        } catch (error) { 
            return error;
        }
    },
    getPets: async (idCliente) => {
        try {

            const response = await db('animal')
            .join('cliente', "cliente.id_cliente", '=', 'animal.id_cliente')
            .select('animal.id_animal', 'animal.nome', 'animal.id_cliente')
            .where({'cliente.status': 'A', 'animal.status': 'A', 'animal.id_cliente':idCliente})
            
            return response;

        } catch (error) { 
            return error;
        }
    }
}