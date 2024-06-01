const fs = require("fs");
const path = require("path");
const {v4 : uuid } = require("uuid");

const dirCodes = path.join(__dirname , '../codes');
 
const createLanguageDirs = () => {
    const languages = ['cpp' , 'java' , 'python'];
    languages.forEach(lang => {
        const langPath = path.join(dirCodes , lang);
        if(!fs.existsSync(langPath)){
            fs.mkdirSync(langPath , {recursive : true});
        }
    });
};

createLanguageDirs();

const generateFile = (language , code) => {
    const jobId = uuid();
    const filename = `${jobId}.${language}`;
    const filePath = path.join(dirCodes , language , filename);
    fs.writeFileSync(filePath , code);
    return filePath;
};

module.exports = {
    generateFile,
}