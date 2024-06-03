const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, '../outputs');

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executePython = (filePath, inputFilePath, timeout = 10000) => {
    return new Promise((resolve, reject) => {
        const command = `python "${filePath}" < "${inputFilePath}"`;
        exec(command, { timeout }, (error, stdout, stderr) => {
            if (error) {
                return reject({ error: error.message, stderr });
            }
            if (stderr) {
                return reject({ error: stderr });
            }
            resolve(stdout);
        });
    });
};

module.exports = {
    executePython,
};
