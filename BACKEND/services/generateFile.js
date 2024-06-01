const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, '../codes');

// Ensure that all necessary directories exist
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
    const jobId = uuid();
    const filename = `${jobId}.${language}`;
    const filePath = path.join(dirCodes, language, filename);

    console.log(`Writing file to path: ${filePath}`);

    // Ensure the directory exists before writing the file
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Directory created: ${dirPath}`);
    }

    fs.writeFileSync(filePath, code);
    return filePath;
};

module.exports = {
    generateFile,
};
