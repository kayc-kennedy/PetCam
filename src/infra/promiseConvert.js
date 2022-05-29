const hbjs = require("handbrake-js");

async function convertVideo(path, filename){
    await hbjs.run({input: `${path}old_${filename}`, output: `${path}${filename}`})
}

module.exports = { convertVideo }