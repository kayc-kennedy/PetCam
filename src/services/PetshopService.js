const jwt = require('jsonwebtoken');
const PetshopRepository = require('../repositories/PetshopRepository');
require('dotenv').config()

module.exports = {
    registerPet: async (data) => {
        const { id_cliente, nome, raca, cor, data_nascimento, sexo, status = 'A' } = data

        try {
            const response = await PetshopRepository.registerPet({id_cliente, nome, raca, cor, data_nascimento, sexo, status});

            if(response[0]) return { "message": "Pet cadastrado com sucesso", "status_code": 201 }         
            return { "message":"Erro ao cadastrar pet", "status_code": 404 }

        } catch (error) {
            console.log(error)
            return { "message": "Erro ao realizar cadastro", "status_code": 422 }
        }
    },

    getListAcess: async (data) => {
        const { id_petshop } = data
        try {
            const response = await PetshopRepository.getListAcess(id_petshop);

            if(response[0]) return { response, "status_code": 200 }          
            return { response, "status_code": 404 }
            
        } catch (error) {
            console.log(error)
            return { "message": "Erro ao buscar acessos", "status_code": 422 }
        }
    },
    
    getClients: async (data) => {
        try {
            const { id_petshop } = data
            let ClientsAndPets = []

            // Busco os clientes
            const response_clients = await PetshopRepository.getClients(id_petshop);
            
            if(response_clients){
                for await(let i of response_clients){

                    let id_cliente = i.id_cliente;
                    const response_pets = await PetshopRepository.getPets(id_cliente)
                   
                    ClientsAndPets.push({
                        "id_cliente": i.id_cliente,
                        "nome": i.nome,
                        "email": i.email,
                        "status": i.status,
                        "animais": response_pets
                    })
                }
            }

            if(ClientsAndPets[0]) return { ClientsAndPets, "status_code": 200 }          
            return { response_clients, "status_code": 404 }
            
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