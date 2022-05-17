const jwt = require('jsonwebtoken');
const CameraRepository = require('../repositories/CameraRepository');
require('dotenv').config()

module.exports = {
    getAllCameras: async (idPetshop) => {
        try {
            const response = await CameraRepository.getAllCameras(idPetshop);

            if(response[0]) return { response, "status_code": 200 }          
            return { response, "status_code": 404 }
            
        } catch (error) {
            console.log(error)
            return { "message": "Erro ao buscar as cameras", "status_code": 422 }
        }
    },

    insertGrantAcess: async (data) => {
        try {
            const {id_animal, id_petshop, status='A'} = data
            const response = await CameraRepository.insertGrantAcess({id_petshop, id_animal, status});
            
            
            if(response[0]) {
                const id_acesso_camera = response[0]
                const response_recording = await CameraRepository.insertRecording(id_animal, id_petshop, id_acesso_camera);
                return { "message":"Acesso liberado com sucesso", "status_code": 201 }         
            } 

            return { "menssage":"Erro ao liberar acesso. Pet ou cliente não cadastrados no sistema", "status_code": 404 }
            
        } catch (error) {
            console.log(error)
            return { "message": "Erro ao inserir acessos", "status_code": 422 }
        }
    }
    
}