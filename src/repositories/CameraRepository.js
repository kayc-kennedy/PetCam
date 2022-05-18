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
    alreadyAcess: async (id_animal) => {
        try {
            const alreadyAcess =  await db('acesso_camera')
            .select('acesso_camera.id_acesso_camera')
            .where({'acesso_camera.status':"A", "acesso_camera.id_animal":id_animal})
    
            return alreadyAcess;

        } catch (error) { 
            return error;
        }
    },
    insertGrantAcess: async (data) => {
        try {

            const response = await db('acesso_camera').insert(data)
            return response

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
            const listCamera = await db.raw(`select c.id_camera, c.ddns, c.porta, c.usuario, c.senha, c.link_rtspme, c.setor from petcam.acesso_camera ac 	inner join petcam.petshop pt on ac.id_petshop = pt.id_petshop     inner join petcam.camera c on pt.id_petshop  = c.id_petshop     inner join petcam.animal a on a.id_animal = ac.id_animal     where a.id_cliente =   ${id_cliente}      and c.status = ac.status    		and ac.status = 'a' group by c.id_camera, c.ddns, c.porta, c.usuario, c.senha, c.link_rtspme, c.setor`);
            
            return listCamera[0];

        } catch (error) { 
            console.log(error)
            return error;
        }
    },
    
}