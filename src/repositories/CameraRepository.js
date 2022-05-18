const { response } = require('express');
const db = require('../db')

module.exports = {
    getAllCameras: async (id_petshop) => {
        try {
            const response = await 
            db('camera')
                .join('petshop', "petshop.id_petshop", '=', 'camera.id_petshop')
                .select('camera.id_camera', 'camera.setor', 'camera.status')
                .where({'petshop.id_petshop':id_petshop});

            return response;

        } catch (error) { 
            return error;
        }
    },
    insertGrantAcess: async (data) => {
        try {
            const response = await db('acesso_camera').insert(data)

            return response;

        } catch (error) { 
            return error;
        }
    },
    insertRecording: async (id_animal, id_petshop, id_acesso_camera) => {
        try {
            const responseCameraList = 
            await db('camera')
                .select('camera.id_camera')
                .where({'camera.status':"A", "camera.id_petshop":id_petshop})
                
            let jsonRecording = []
            for (let i = 0; i < responseCameraList.length; i++) {
                let id_camera = responseCameraList[i].id_camera;
                
                jsonRecording.push({id_animal: id_animal,
                                    id_acesso_camera: id_acesso_camera,
                                    id_camera: id_camera})
            
            }
            const response = await db('gravacao').insert(jsonRecording)
            
            if(response){
                return jsonRecording.length
            }
            return 0;

        } catch (error) { 
            console.log(error)
            return error;
        }
    },
    blockAcessClient: async (id_petshop, id_animal, status) => { // REVISAR 
        try {
            const response = await 
                db('acesso_camera')
                    .where({'id_animal':id_animal, 'id_petshop':id_petshop})
                    .update({status: status});
            
            return response;

        } catch (error) { 
            console.log(error)
            return error;
        }
    },
    changeStatusCamera: async (id_camera, id_petshop, status) => {
        try {
            console.log(id_camera, id_petshop, status);
            const response = await 
                db('camera')
                    .where({'id_camera':id_camera, 'id_petshop':id_petshop})
                    .update({status: status});

            return response;

        } catch (error) { 
            console.log(error)
            return error;
        }
    },
    getCamerasAvailable: async (id_cliente) => {
        try {
            const response = await 
            db('acesso_camera')
                .join({'petshop', "petshop.id_petshop":'acesso_camera.id_petshop','petshop.id_petshop':'camera.id_petshop'})
                .join('animal', "animal.id_animal", '=', 'acesso_camera.id_animal')
                .select('animal.id_cliente', 'camera.id_camera')
                .where({ 'animal.id_cliente':id_cliente, 'acesso_camera.status':'A'});

            return response;

        } catch (error) { 
            console.log(error)
            return error;
        }
    },
    
}