const Solution = require("../models/Solution");
const Problem = require("../models/Problem");
const TestCase = require("../models/TestCase");

//Writing the create solution handler
exports.solveProblem = async (req , res) => {
    try{
        //Get the data from the Request Body
        const {user , problem , code} = req.body;

        //Validate the user and the problem existence
        const existingUser = await User.findById(user);
        const existingProblem = await Problem.findById(problem);
        if(!existingUser || !existingProblem){
            return res.status(400).json({
                success : false,
                message : "User or problem not found",
            });
        }

        const newSolution = new Solution({user , problem , code});
        //Saving the entry in the DB
        await newSolution.save();

        res.status(201).json({
        
        })

    }catch(error){

    }
}


//Writing the get all solutions handler



//Verify the Solution