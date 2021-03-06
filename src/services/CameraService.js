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

    getRecording: async (data) => {
        try {
            const {id_animal, id_camera} = data
            const response = await CameraRepository.getRecording(id_animal, id_camera);
            
            if(response[0]) return { response, "status_code": 200 }          
            return { response, "status_code": 404 }
            
        } catch (error) {
            console.log(error)
            return { "message": "Erro ao buscar as cameras", "status_code": 422 }
        }
    },
    
    insertCamera: async (data) => {
        try {
            const { id_petshop, link_rtsp_gravado, link_rtsp_aovivo, setor, status = "A" } = data

            if(!link_rtsp_aovivo || !link_rtsp_gravado ) return { "message": "Erro ao cadastrar camera, informe um link rtsp válido", "status_code": 400 }

            const response = await CameraRepository.insertCamera({id_petshop, link_rtsp_gravado, link_rtsp_aovivo, setor, status});
            
            if(response[0]) return { "id_camera":response[0], "status_code": 201 }          
            
            return { response, "status_code": 400 }
            
        } catch (error) {
            console.log(error)
            return { "message": "Erro ao buscar as cameras", "status_code": 422 }
        }
    },
    

    insertGrantAcess: async (data) => {
        try {
            const {id_animal, id_petshop, status='A'} = data

            // Verifica se  petshop tem cameras validas
            const existeCamera = await CameraRepository.getAllCameras(id_petshop, filtra_status = true);
            if(!existeCamera[0]) return { "message":"Erro ao liberar acesso. O Petshop não possui cameras cadastradas ou ativas", "status_code": 406 }
            
            //Verifica se o pet já não está em atendimento
            const alreadyAcess = await CameraRepository.alreadyAcess(id_animal);
            if(alreadyAcess[0]) return { "message":"O pet informado já possui um atendimento ativo, ou seja o dono já possue acesso as cameras", "status_code": 400 }    

            // Insiro o acesso a camera
            const response = await CameraRepository.insertGrantAcess({id_petshop, id_animal, status});            
            
            // Inicio a gravacao e salvo o registro no banco
            if(response[0]){
                const id_acesso_camera = response[0]
                const recording = await CameraRepository.insertRecording(id_animal, id_petshop, id_acesso_camera);
                
                if(recording){
                    return { "message":"Acesso liberado com sucesso. Gravações iniciadas.",
                             "cameras_gravando": `${recording.responseRecording}`,
                             "cameras_ao_vivo":  `${recording.lengthJsonRecording}`,
                             "status_code": 201 }         
                } 
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
            
            if(!response.id_acesso_camera) return { "message":"Acesso informado não existe.", "status_code": 404 }

            if(response){
                
                let acesso_removido = response.response_acesso_camera > 0 ? true:false
                let gravacoes_interrompidas = response.response_gravacao > 0 && response.kill_process ? true:false;

                return { "message":"Acesso removido com sucesso", 
                         "acesso_removido": acesso_removido,
                         "gravacoes_interrompidas": gravacoes_interrompidas,
                        "status_code": 200 }}
                ;         
        
            return { "message":"Erro ao cancelar acesso.", "status_code": 404 };
            
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
        
            return { "menssage":"Câmera não encontrada", "status_code": 404 };
            
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