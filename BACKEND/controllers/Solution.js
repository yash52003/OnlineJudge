const Solution = require("../models/Solution");
const Problem = require("../models/Problem");
const { generateFile } = require("../services/generateFile");
const { executeCpp } = require("../scripts/executeCpp");
const { executePython } = require("../scripts/executePython");
const { executeJava } = require("../scripts/executeJava");
const fs = require("fs");
const path = require("path");

const submitSolution = async (req, res) => {
    try {
        const { language, code } = req.body;
        const { id: problemId } = req.params;
        const userId = req.user.id;

        if (!code || !language) {
            return res.status(400).json({
                success: false,
                error: "Code or language is missing",
            });
        }

        const problem = await Problem.findById(problemId).populate('testCases');
        if (!problem) {
            return res.status(404).json({
                success: false,
                error: "Problem not found",
            });
        }

        const filePath = generateFile(language, code);
        const inputOutputPairs = problem.testCases.map(testCase => ({
            input: testCase.input,
            output: testCase.output,
        }));

        const results = [];
        let finalVerdict = "Accepted";

        for (const [index, { input, output }] of inputOutputPairs.entries()) {
            const inputDirectory = path.join(__dirname, '../testcases/inputs');
            if (!fs.existsSync(inputDirectory)) {
                fs.mkdirSync(inputDirectory, { recursive: true });
            }

            const inputFilePath = path.join(inputDirectory, `${path.basename(filePath, `.${language}`)}_${index}.txt`);
            fs.writeFileSync(inputFilePath, input);

            try {
                let execResult;
                if (language === 'cpp') {
                    execResult = await executeCpp(filePath, inputFilePath);
                } else if (language === 'python') {
                    execResult = await executePython(filePath, inputFilePath);
                } else if (language === 'java') {
                    execResult = await executeJava(filePath, inputFilePath);
                } else {
                    console.log("Unsupported language");
                    throw new Error('Unsupported language');
                }

                execResult = execResult.trim();
                console.log(execResult);
                const verdict = execResult === output.trim() ? "Accepted" : "Wrong Answer";
                if (verdict !== "Accepted") {
                    finalVerdict = verdict;
                    break; // Stop processing further test cases if any one of them fails
                }
                results.push({ input, expectedOutput: output, actualOutput: execResult, verdict });
            } catch (error) {
                console.error(`Error executing test case ${index + 1}:`, error);
                finalVerdict = "Incorrect Code"; // Set final verdict to "Incorrect Code" if there's an actual runtime error
                results.push({ input, expectedOutput: output, actualOutput: error.message || error.stderr || "Error", verdict: "Incorrect Code" });
                break; // Stop processing further test cases if there's a runtime error
            }
        }

        const solution = new Solution({
            user: userId,
            problem: problemId,
            code,
            verdict: finalVerdict,
        });
        await solution.save();
        console.log(finalVerdict);
        res.json({ success: true, filePath, finalVerdict });
    } catch (error) {
        console.error('Error submitting solution:', error);

        res.status(500).json({
            success: false,
            error: "Something went wrong",
        });
    }
};
module.exports = {
    submitSolution,
};
