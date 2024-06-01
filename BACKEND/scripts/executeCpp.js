const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "../outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
    console.log(`Output directory created: ${outputPath}`);
}

const executeCpp = (filePath, inputFilePath) => {
    const jobId = path.basename(filePath).split(".")[0];
    const outputFilename = `${jobId}.exe`;
    const outPath = path.join(outputPath, outputFilename);

    console.log(`Compiling and executing C++ file: ${filePath}`);

    return new Promise((resolve, reject) => {
        exec(`g++ "${filePath}" -o "${outPath}" && "${outPath}" < "${inputFilePath}"`, {
            shell: 'cmd.exe'
        }, (error, stdout, stderr) => {
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
