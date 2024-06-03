const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "../outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
    // console.log(`Output directory created: ${outputPath}`);
}

const executeCpp = (filePath, inputFilePath, timeout = 10000) => {
    const jobId = path.basename(filePath).split(".")[0];
    const outputFilename = `${jobId}.exe`;
    const outPath = path.join(outputPath, outputFilename);

    // console.log(`Compiling and executing C++ file: ${filePath}`);

    return new Promise((resolve, reject) => {
        const command = `g++ "${filePath}" -o "${outPath}" && "${outPath}" < "${inputFilePath}"`;
        exec(command, { timeout, shell: 'cmd.exe' }, (error, stdout, stderr) => {
            if (error) {
                // console.error(`Compilation or execution error: ${error.message}`);
                return reject({ error: error.message, stderr });
            }
            if (stderr) {
                // console.error(`Standard error output: ${stderr}`);
                return reject({ error: stderr });
            }
            resolve(stdout);
        });
    });
};

module.exports = {
    executeCpp,
};
