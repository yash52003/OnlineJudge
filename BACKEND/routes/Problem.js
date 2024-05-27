//Make the instance of the express 
const express = require("express");

//Construct the instance of the router
const router = express.Router();

//Importing the handler functions 
const {getAllProblemsWithUserStatus , createProblem , deleteProblem} = require("../controllers/Problems");
const {auth , isAdmin}  = require("../middlewares/Auth");

//Get all the problems with the use status (solved/not_solved)
router.get("/getProblemsStatus" , auth , getAllProblemsWithUserStatus);

//Create a new problem (This is a protected route for admins only)
router.post("/createProblem" , auth , isAdmin  , createProblem);

//Delete the problem by Id (Admin only)
router.delete("/deleteProblem" , auth , isAdmin , deleteProblem);

module.exports = router;