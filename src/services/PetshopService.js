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
            
            // console.log(response_clients)
            let animais = []

            if(response_clients){
                let count = 0;
                for await(let i of response_clients){

                    let id_cliente = i.id_cliente;
                    const response_pets = await PetshopRepository.getPets(id_cliente)
                    
                    console.log(response_pets)
                    console.log("cliente")
                    // console.log(response_pets[count])

                    // console.log("coontador: "  + count)
                    // for await(let x of response_pets){
                    //     console.log(x)
                    //     console.log("animal")
                    //     animais.push({id_animal:response_pets[0].id_animal,
                    //         nome_pet:response_pets[count].nome
                    //       })
                    // }

                    // console.log(animais)

                    // console.log(response_pets.indexOf( x => x.id_cliente == i.id_cliente) +1)

                    // animais.push(response_pets.indexOf(i, 0))
                    // count++
                    // console.log(count)

                   
                    ClientsAndPets.push({
                        "id_cliente": i.id_cliente,
                        "nome": i.nome,
                        "email": i.email,
                        "status": i.status,
                        "animais": animais
                    })
                    // console.log(ClientsAndPets)
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