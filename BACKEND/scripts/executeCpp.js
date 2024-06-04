const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, '../outputs');

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filePath, inputFilePath, timeout = 10000) => {
    const jobId = path.basename(filePath).split(".")[0];
    const outputFilename = `${jobId}.out`;
    const outPath = path.join(outputPath, outputFilename);

    return new Promise((resolve, reject) => {
        const command = `g++ "${filePath}" -o "${outPath}" && "${outPath}" < "${inputFilePath}"`;
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
    executeCpp,
};
