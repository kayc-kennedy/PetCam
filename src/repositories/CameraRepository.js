const { response } = require('express');
const db = require('../db')

module.exports = {
    getAllCameras: async (idPetshop) => {
        try {
            const response = await db('camera')
            .join('petshop', "petshop.id_petshop", '=', 'camera.id_petshop')
            .select('camera.id_camera', 'camera.setor', 'camera.status')
            .where({'petshop.id_petshop':idPetshop})

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
    insertRecording: async (id_animal, id_acesso_camera) => {
        try {
            const responsePetshopList = await db('camera')
            .select('camera.id_camera')
            .where({'camera.status':"A"})

            var count = 0;
            console.log(responsePetshopList.length)
            for(let i = 0; i < responsePetshopList.length; i++){
                let id_camera = responsePetshopList[i]
                
                console.log(id_animal, id_acesso_camera, id_camera)

                await db('gravacao').insert({ id_animal, id_acesso_camera, id_camera })
                count++
            }

            return response;

        } catch (error) { 
            return error;
        }
    }
}