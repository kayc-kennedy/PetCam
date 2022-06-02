var child_process = require('child_process')
var pathToFfmpeg = require('ffmpeg-static')

function convertVideo (path, filename) {
    return new Promise((resolve, reject) => {
        
        var conversao = child_process.spawn(pathToFfmpeg,
            ["-i", `${path}old_${filename}`, `${path}${filename}`],
            { detached: false }
        ); 

        conversao.stderr.on('data', (data) => {
            
        })

        conversao.on('close', function(code) {
            if(code) {
                reject(false)
            }
            resolve(true)
        });
    })
}

module.exports = { convertVideo }