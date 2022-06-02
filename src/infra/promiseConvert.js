
var ffmpeg = require('fluent-ffmpeg')

function convertVideo(path, filename){
    return new Promise((resolve, reject)=> {
        ffmpeg(`${path}old_${filename}`)
        .format("matroska")
        .save(`${path}${filename}`)
        .on('end', () => {
            resolve(true)
        })
        .on('error', (err) => {
            console.error('Ffmpeg-static error: '+ err.message)
            reject(err.message)
        })

    })
        
}

module.exports = { convertVideo }