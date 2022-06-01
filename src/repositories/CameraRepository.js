const db = require('../db');
const recording = require('../rtsp/recording');
const aws = require('../infra/aws') 
const convert = require('../infra/promiseConvert') 
const fs = require('fs');


module.exports = {  
    getAllCameras: async (id_petshop) => {
        try {
            const response = await 
            db('camera')
                .join('petshop', "petshop.id_petshop", '=', 'camera.id_petshop')
                .select('camera.id_camera', 'camera.link_rtsp_aovivo', 'camera.setor', 'camera.status')
                .where({'petshop.id_petshop':id_petshop});

            return response;

        } catch (error) { 
            return error;
        }
    },

    insertCamera: async (data) => {
        try {

            const response = await db('camera').insert(data)
            return response

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
                .select('camera.id_camera', 'camera.link_rtsp_gravado')
                .where({'camera.status':"A", "camera.id_petshop":id_petshop})
            
            
            let jsonRecording = []
            for (let i = 0; i < responseCameraList.length; i++) {
                let id_camera = responseCameraList[i].id_camera
                let url = responseCameraList[i].link_rtsp_gravado

                jsonRecording.push({id_animal: id_animal,
                                    id_acesso_camera: id_acesso_camera,
                                    id_camera: id_camera,
                                    url: url})
            
            }

            let lengthJsonRecording = jsonRecording.length;
            const repository  = './videos/'

            for (let i = 0; i < lengthJsonRecording; i++){
                const nome_arquivo = `${repository}old_${jsonRecording[i].id_camera}_${id_animal}_${id_petshop}.mp4`;

                let pid = recording.recordStream(nome_arquivo, jsonRecording[i].url ) 
                jsonRecording[i].id_processo = pid
                jsonRecording[i].nome_arquivo = `${jsonRecording[i].id_camera}_${id_animal}_${id_petshop}.mp4`;
            }

            let responseRecording = false;
            if(jsonRecording[0].id_processo){ // Verifico se as gravações foram iniciadas, se sim, insito no banco o registro
                
                for(let i = 0; i < jsonRecording.length; i++){ // Removo o campo URL
                    delete jsonRecording[i].url;
                }
                responseRecording = await db('gravacao').insert(jsonRecording);
                responseRecording = true
            }
        
            // Quantidade de cameras disponiveis / Gravações iniciadas
            return {lengthJsonRecording, responseRecording};

        } catch (error) { 
            console.log(error)
            return error;
        }
    },

    blockAcessClient: async (id_petshop, id_animal, status) => { // REVISAR 
        try {
            const dataRecordign = await 
                db('gravacao')
                    .join('acesso_camera', 'gravacao.id_acesso_camera', '=', 'acesso_camera.id_acesso_camera')
                    .select('gravacao.id_gravacao', 'gravacao.id_processo', 'acesso_camera.id_acesso_camera', 'gravacao.nome_arquivo')
                    .where({'acesso_camera.id_petshop':id_petshop, 'acesso_camera.id_animal':id_animal, 'acesso_camera.status':'A'})

            // O acesso camera será unico sempre, então pode-se usar a primeira posicao achada
            let id_acesso_camera = dataRecordign[0].id_acesso_camera
            // console.log(id_acesso_camera)
            // Se a gravacao nao existir, encerro o fluxo
            if(!id_acesso_camera) return id_acesso_camera = false

            if(dataRecordign[0]){
                // Mudo o status do Acesso as cameras ao vivo
                const response_acesso_camera = await 
                db('acesso_camera')
                    .where({'acesso_camera.id_acesso_camera':id_acesso_camera })
                    .update({status: status});

                // Encerro as gravações de todas as cameras
                let kill_process;
                for(let i = 0; i < dataRecordign.length; i++){
                    kill_process = process.kill(dataRecordign[i].id_processo);
                }
                // Encerro as gravações no banco
                const response_gravacao = await 
                db('gravacao')
                    .where({'gravacao.id_acesso_camera':id_acesso_camera})
                    .update({data_hora_fim: new Date() });
                                
                // Subo os videos para AWS
                for(let i = 0; i < dataRecordign.length; i++){
                    const filename =  dataRecordign[i].nome_arquivo
                    const path = './videos/' 
                    // Converto os videos gravados para mp4 
                    const fileConvert = convert.convertVideo(path, filename)

                    fileConvert
                        .then((data)=>{
                            // Envio para a AWS
                            aws.uploadAWS(dataRecordign[i].nome_arquivo)
                                .then(()=>{
                                    console.log(`Arquivo ${path}${filename} enviado para a AWS`)
                                    // Apago os videos após o envio 
                                    fs.unlink(`${path}${filename}`, (err)=>{
                                        if (err)  console.log(err);
                                        console.log(`Arquivo ${path}${filename} deletado`);
                                    }) 
                                    fs.unlink(`${path}old_${filename}`, (err)=>{
                                        if (err)  console.log(err);
                                        console.log(`Arquivo ${path}old_${filename} deletado`);
                                    })  
                                })
                        })
                        .catch((err)=>{
                            console.log(err)
                        })     
                }

                return {response_acesso_camera, response_gravacao, kill_process, id_acesso_camera}
            }
            return false

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
            const listCamera = await db.raw(`select c.id_camera, c.link_rtsp_aovivo, c.setor from petcam.acesso_camera ac inner join petcam.petshop pt on ac.id_petshop = pt.id_petshop inner join petcam.camera c on pt.id_petshop  = c.id_petshop inner join petcam.animal a on a.id_animal = ac.id_animal  where a.id_cliente = ${id_cliente} and c.status = ac.status and ac.status = 'A' group by c.id_camera, c.link_rtsp_aovivo, c.setor`);
            
            return listCamera[0];

        } catch (error) { 
            console.log(error)
            return error;
        }
    },
    
}