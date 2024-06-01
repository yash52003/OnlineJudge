const fs = require("fs");
const path = require("path");
const {exec} = require('child_process');

const outputPath = path.join(__dirname , '../outputs');

if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath , {recursive : true});
}

const executePython = (filepath , inputFilePath) => {
    return new Promise((resolve , reject) => {
        exec(`python "${filepath}" <"${inputFilePath}"` , {shell : 'cmd.exe'} , 
            (error , stdout , stderr) => {
                if(error){
                    return reject({error : error.message , stderr});
                }
                if(stderr){
                    return reject({error : stderr});
                }
                resolve(stdout);
            }
        );
    });
};

module.exports = {
    executePython,
}

