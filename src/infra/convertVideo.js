const hbjs = require("handbrake-js");

function convert(filename) {
  const hbjs = require("handbrake-js");

    hbjs.spawn({ input: `${filename}.mp4`, output: `${filename}_convertido.mp4` })
    .on('end', (event)=>{
      console.log(event)
      console.log("Fim da conversao");  
    })
    .on("error", (err) => {
      console.log(err)
    })
    .on('complete', (complete)=>{
      console.log(complete)
      console.log("Completou")
    })
    .on('progress', (pro)=>{
      console.log("%s progressao", pro.percentComplete)
    })
}


convert('./videos/' + '1_1_2');

