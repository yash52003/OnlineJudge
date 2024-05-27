const Problem = require('../models/Problem');
const Solution = require('../models/Solution');

//get all problems - with the user status of solved or not solved 
exports.getAllProblemsWithUserStatus = async (req , res) => {
    try{
        const userId = req.user.id;
        const problems = await Problem.find();
        const solutions = await Solution.find({user : userId});

        const problemsWithStatus = problems.map((problem) => {
            const solved = solution.some(solution => solution.problem.toString() === problem._id.toString() && solution.verdict === 'Accepted');

            return {
                ...problem.toObject(),
                solved,
            };

        });

        return res.status(200).json({
            success : true,
            problems : problemsWithStatus,
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Error in accessing the problems",
        })
    }
};

//create new problem -- Only for the admin 
exports.createProblem = async (req , res) => {

    try{
        const {problemName , problemStatement , difficulty , testCases} = req.body;
        const newProblem = new Problem({problemName , problemStatement ,  difficulty , testCases});

        //Saving the entry in the database
        await newProblem.save();

        res.status(201).json({
            success : true,
            message : "Problem created Successfully",
            problem : newProblem,
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Failed to create the problem",
        })
    }

}

//delete a problem -- Only for the admin
exports.deleteProblem = async (req , res) => {
    try{

        const id = req.params;
        const deletedProblem = await Problem.findByIdAndDelete(id);
        if(!deletedProblem){
            return res.status(400).json({
                success : false,
                message : "Problem not found",
            });
        }

        return res.status(200).json({
            success : true,
            message : "Problem deleted Successfully",
        })

    }catch(error){

        console.log(error);
        res.status(500).json({
            success : false,
            message : "Failed to delete Problem",
        });

    }
};
