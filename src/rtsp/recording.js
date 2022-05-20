var
    fs = require('fs'),
    child_process = require('child_process'),
    readStream

// var url = "rtsp://admin:CYZS2V92@cameratcc.ddns.net:554/cam/realmonitor?channel=1&subtype=0";

function recordStream(nome, url) {
    console.log('iniciando gravação')

    this.readStream = child_process.spawn("ffmpeg",
        ["-rtsp_transport", "tcp", "-i", url, '-f', 'mpeg1video', '-b:v', '800k', '-r', '30', '-'],
        { detached: false }
    );

    this.readStream.stdout.on('data', function(data) {
        // momento de gravação
    });

    // var filename = `${nome}_${dataHora}.mp4`;
    console.log(`Arquivo: ${nome}`)
    var writeStream = fs.createWriteStream(nome);
    this.readStream.stdout.pipe(writeStream);

    return this.readStream.pid
};



module.exports = { recordStream }