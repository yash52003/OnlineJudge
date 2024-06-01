const Solution = require("../models/Solution");
const Problem = require("../models/Problem");
const TestCase = require("../models/TestCase");
const {generateFile} = require("../services/generateFile");
const {executeCpp} = require("../scripts/executeCpp");
const {executePython} = require("../scripts/executePython");
const {executeJava} = require("../scripts/executeJava");
const fs = require("fs");
const path = require("path");

exports.solveProblem = async (req , res) => {
    try{
        const {language , code} = req.body;
        const { id:problemId } = req.params;
        const userId = req.user._id;

        if(!code || !language){
            return res.status(400).json({
                success : false,
                error : "Code or language is missing",
            })
        }

    }

}
