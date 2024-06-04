const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, '../codes');

const createLanguageDirs = () => {
    const languages = ['cpp', 'java', 'python'];
    languages.forEach(lang => {
        const langPath = path.join(dirCodes, lang);
        if (!fs.existsSync(langPath)) {
            fs.mkdirSync(langPath, { recursive: true });
            console.log(`Directory created: ${langPath}`);
        }
    });
};

createLanguageDirs();

const generateFile = (language, code) => {
    console.log(`Generating file for language: ${language}`);

    const jobId = uuid();
    const filename = language === 'java' ? 'Main.java' : `${jobId}.${language}`;
    const filePath = path.join(dirCodes, language, filename);

    console.log(`File will be saved at: ${filePath}`);

    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Directory created: ${dirPath}`);
    }

    fs.writeFileSync(filePath, code);
    console.log(`File successfully generated`);

    return filePath;
};

module.exports = {
    generateFile,
};
