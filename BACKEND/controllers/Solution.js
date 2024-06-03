const fs = require("fs");
const path = require("path");
const { generateFile } = require("../services/generateFile");
const { executeCpp } = require("../scripts/executeCpp");
const { executePython } = require("../scripts/executePython");
const { executeJava } = require("../scripts/executeJava");
const Solution = require("../models/Solution");
const Problem = require("../models/Problem");

const TIMEOUT_MS = 10000; // 10 seconds

const submitSolution = async (req, res) => {
    try {
        const { language, code } = req.body;
        const { id: problemId } = req.params;
        const userId = req.user.id;

        if (!code || !language) {
            // console.log("Code or language is missing");
            return res.status(400).json({
                success: false,
                error: "Code or language is missing",
            });
        }

        const problem = await Problem.findById(problemId).populate('testCases');
        if (!problem) {
            // console.log("Problem not found");
            return res.status(404).json({
                success: false,
                error: "Problem not found",
            });
        }

        const filePath = generateFile(language, code);
        // console.log(`Generated file at ${filePath}`);
        
        const inputOutputPairs = problem.testCases.map(testCase => ({
            input: testCase.input,
            output: testCase.output,
        }));

        const results = [];
        let finalVerdict = "Accepted";
        let failedTestCase = null;

        for (const [index, { input, output }] of inputOutputPairs.entries()) {
            const inputDirectory = path.join(__dirname, '../testcases/inputs');
            if (!fs.existsSync(inputDirectory)) {
                fs.mkdirSync(inputDirectory, { recursive: true });
                // console.log(`Input directory created: ${inputDirectory}`);
            }

            const inputFilePath = path.join(inputDirectory, `${path.basename(filePath, `.${language}`)}_${index}.txt`);
            fs.writeFileSync(inputFilePath, input);
            // console.log(`Written input to ${inputFilePath}`);

            try {
                let execResult;
                switch (language) {
                    case 'cpp':
                        // console.log(`Executing C++ file ${filePath} with input ${inputFilePath}`);
                        execResult = await executeCpp(filePath, inputFilePath, TIMEOUT_MS);
                        break;
                    case 'python':
                        // console.log(`Executing Python file ${filePath} with input ${inputFilePath}`);
                        execResult = await executePython(filePath, inputFilePath, TIMEOUT_MS);
                        break;
                    case 'java':
                        // console.log(`Executing Java file ${filePath} with input ${inputFilePath}`);
                        execResult = await executeJava(filePath, inputFilePath, TIMEOUT_MS);
                        break;
                    default:
                        throw new Error('Unsupported language');
                }

                execResult = execResult.trim();
                // console.log(`Execution result: ${execResult}`);
                
                const verdict = execResult === output.trim() ? "Accepted" : "Wrong Answer";
                if (verdict !== "Accepted") {
                    finalVerdict = verdict;
                    failedTestCase = index + 1; // Set the failed test case index
                    break; // Stop processing further test cases if any one of them fails
                }
                results.push({ input, expectedOutput: output, actualOutput: execResult, verdict });
            } catch (error) {
                // console.error(`Error executing test case ${index + 1}:`, error);
                finalVerdict = "Incorrect Code"; // Set final verdict to "Incorrect Code" if there's an actual runtime error
                failedTestCase = index + 1; // Set the failed test case index
                results.push({ input, expectedOutput: output, actualOutput: error.message || error.stderr || "Error", verdict: "Incorrect Code" });
                break; // Stop processing further test cases if there's a runtime error
            } finally {
                // Delete input file after each iteration
                fs.unlinkSync(inputFilePath);
                // console.log(`Deleted input file ${inputFilePath}`);
            }
        }

        console.log(results);
        const solution = new Solution({
            user: userId,
            problem: problemId,
            code,
            verdict: finalVerdict,
        });
        await solution.save();
        // console.log("Solution saved to database");

        // Delete generated code file after saving solution
        fs.unlinkSync(filePath);
        // console.log(`Deleted generated code file ${filePath}`);

        // Clean up output directory
        const outputFiles = fs.readdirSync(path.join(__dirname, '../outputs'));
        outputFiles.forEach(file => {
            const filePath = path.join(__dirname, '../outputs', file);
            fs.unlinkSync(filePath);
            // console.log(`Deleted output file ${filePath}`);
        });

        res.json({ success: true, finalVerdict, failedTestCase, results });
    } catch (error) {
        // console.error('Error submitting solution:', error);

        res.status(500).json({
            success: false,
            error: "Something went wrong",
        });
    }
};

module.exports = {
    submitSolution,
};
