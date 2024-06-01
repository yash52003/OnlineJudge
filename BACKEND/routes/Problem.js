//Make the instance of the express 
const express = require("express");

//Construct the instance of the router
const router = express.Router();

//Importing the handler functions
const {
    getAllProblemsWithUserStatus,
    createProblem,
    deleteProblem,
    getAllProblems,
    updateProblem,
    getProblemById,
} = require("../controllers/Problems");

const { submitSolution } = require("../controllers/Solution");

//Importing the middlewares
const { auth, isAdmin } = require("../middlewares/Auth");

// Get all problems with the user status (solved/not_solved)
router.get("/getProblemsStatus", auth, getAllProblemsWithUserStatus);

// Create a new problem (Admin only)
router.post("/createProblem", auth, isAdmin, createProblem);

// Delete a problem by ID (Admin only)
router.delete("/deleteProblem/:id", auth, isAdmin, deleteProblem);

//update the problem for Id(Admins only)
router.put('/updateProblem/:id', auth, isAdmin, updateProblem);

// Get all problems
router.get("/getAllProblems" ,  getAllProblems);

//Get Problem By Id
router.get('/getProblem/:id', getProblemById);

//update the problem according to the id 
router.put('/updateProblem/:id', updateProblem);

//Submit the solution by the id
router.post('/submitSolution/:id', auth, submitSolution);

module.exports = router;