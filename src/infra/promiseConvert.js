const hbjs = require("handbrake-js");

async function convertVideo(filename){
    await hbjs.run({input: `${filename}`, output: `${filename}`})
}

module.exports = { convertVideo }