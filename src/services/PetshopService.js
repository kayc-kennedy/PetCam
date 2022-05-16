const jwt = require('jsonwebtoken');
const PetshopRepository = require('../repositories/PetshopRepository');
require('dotenv').config()

module.exports = {
    registerPet: async (data) => {
        const { id_cliente, nome, raca, cor, data_nascimento, sexo, status = 'A' } = data

        try {
            const response = await PetshopRepository.registerPet({id_cliente, nome, raca, cor, data_nascimento, sexo, status});

            return { "message": "Pet cadastrado com sucesso", "status_code": 201 }

        } catch (error) {
            console.log(error)
            return { "message": "Erro ao realizar cadastro", "status_code": 422 }
        }
    },

    getClients: async () => {
        try {
            const response = await PetshopRepository.getClients();

            if(response[0]) return { response, "status_code": 200 }          
            return { response, "status_code": 404 }
            
        } catch (error) {
            console.log(error)
            return { "message": "Erro ao buscar os clientes", "status_code": 422 }
        }
    },
    getPets: async (idCliente) => {
        try {
            const response = await PetshopRepository.getPets(idCliente);
            
            if(response[0]) return { response, "status_code": 200 }          
            return { response, "status_code": 404 }

        } catch (error) {
            console.log(error)
            return { "message": "Erro ao buscar os pets", "status_code": 422 }
        }
    }
    
}