var
    fs = require('fs'),
    child_process = require('child_process'),
    readStream

var pathToFfmpeg = require('ffmpeg-static');

function recordStream(nome, url) {
    console.log(url)
    this.readStream = child_process.spawn(pathToFfmpeg,
        ["-rtsp_transport", "tcp", "-i", url, '-f', 'mpeg1video', '-b:v', '800k', '-r', '30', '-'],
        { detached: false }
    );
    var writeStream = fs.createWriteStream(nome);

    this.readStream.stdout.on('data', function(data) {
        // momento de gravação
        if(!data){
            writeStream.end()
            return false
        } 
    });

    console.log(`Gravando. Arquivo: ${nome}`)
    this.readStream.stdout.pipe(writeStream);

    return this.readStream.pid
};

module.exports = { recordStream }