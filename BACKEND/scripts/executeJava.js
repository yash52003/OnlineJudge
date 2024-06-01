const fs = require("fs");
const path = require("path");
const {exec} = require("child_process");

const executeJava = (filepath , inputFilePath) => {
    const dir = path.dirname(filepath);
    const filename = path.basename(filepath , '.java');

    return new Promise((resolve , reject) => {
        exec(`javac "${filepath}" && java -cp "${dir}" ${filename} < "${inputFilePath}"` , {
            shell : 'cmd.exe'
        },
        (error , stdout , stderr) => {
            if(error){
                return reject({error : error.message , stderr});
            }
            if(stderr){
                return reject({error : stderr});
            }
            resolve(stdout);
        });
    });
};

module.exports = {
    executeJava,
}