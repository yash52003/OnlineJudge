const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, '../outputs');

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeJava = (filePath, inputFilePath, timeout = 10000) => {
    const dir = path.dirname(filePath);
    const filename = path.basename(filePath, '.java');

    return new Promise((resolve, reject) => {
        const command = `javac "${filePath}" && java -cp "${dir}" ${filename} < "${inputFilePath}"`;
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
    executeJava,
};
