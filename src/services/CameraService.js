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
            const alreadyAcess = await CameraRepository.alreadyAcess(id_animal);

            if(alreadyAcess[0]) return { "message":"O pet informado já possui um atendimento ativo, ou seja o dono já possue acesso as cameras", "status_code": 201 }    


            const response = await CameraRepository.insertGrantAcess({id_petshop, id_animal, status});            
            
            if(response[0]){
                const id_acesso_camera = response[0]
                const response_recording = await CameraRepository.insertRecording(id_animal, id_petshop, id_acesso_camera);
                return { "message":"Acesso liberado com sucesso. Quantidade de cameras disponiveis: " + response_recording, "status_code": 201 }         
                 
            }
            
            return { "menssage":"Erro ao liberar acesso. Pet ou cliente não cadastrados no sistema", "status_code": 404 }
            
        } catch (error) {
            console.log(error)
            return { "message": "Erro ao inserir acessos", "status_code": 422 }
        }
    },

    blockAcessClient: async (data) => {
        try {
            const {id_animal, id_petshop, status='I'} = data
            const response = await CameraRepository.blockAcessClient(id_petshop, id_animal, status);
                       
            if(response) return { "message":"Acesso removido com sucesso", "status_code": 200 };         
        
            return { "menssage":"Erro ao cancelar acesso. Petshop ou Animal incorretos", "status_code": 404 };
            
        } catch (error) {
            console.log(error)
            return { "message": "Erro ao cancelar acesso", "status_code": 422 }
        }
    },

    changeStatusCamera: async (data) => {
        try {
            const {id_camera, id_petshop, status} = data
            const response = await CameraRepository.changeStatusCamera(id_camera, id_petshop, status);
                       
            if(response) return { "message":"Câmera alterada com sucesso", "status_code": 200 };         
        
            return { "menssage":"Camerâ não encontrada", "status_code": 404 };
            
        } catch (error) {
            console.log(error)
            return { "message": "Erro ao alterar câmera", "status_code": 422 }
        }
    },

    getCamerasAvailable: async (data) => {
        try {
            const { id_cliente } = data
            const response = await CameraRepository.getCamerasAvailable(id_cliente);

            if(response[0]) return { response, "status_code": 200 }          
            return { response, "status_code": 404 }
            
        } catch (error) {
            console.log(error)
            return { "message": "Erro ao buscar as cameras", "status_code": 422 }
        }
    },
    

}