const Problem = require('../models/Problem');
const Solution = require('../models/Solution');
const TestCase = require("../models/TestCase");
const mongoose = require("mongoose");

// Get all problems with user status (solved/not solved)
exports.getAllProblemsWithUserStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const problems = await Problem.find();
    const solutions = await Solution.find({ user: userId });

    const problemsWithStatus = problems.map((problem) => {
      const solved = solutions.some(solution => 
        solution.problem.toString() === problem._id.toString() && solution.verdict === 'Accepted'
      );

      return {
        ...problem.toObject(),
        solved,
      };
    });

    return res.status(200).json({
      success: true,
      problems: problemsWithStatus,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in accessing the problems",
    });
  }
};

// Get all problems
exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find({});

    return res.status(200).json({
      success: true,
      problems,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in accessing the problems",
    });
  }
};

// Create new problem (Admin only)
exports.createProblem = async (req, res) => {
  try {
      const { problemName, problemStatement, difficulty, testCases } = req.body;

      // Save test cases first
      const savedTestCases = await TestCase.create(testCases);

      // Get only the ObjectIds of saved test cases
      const testCaseIds = savedTestCases.map(testCase => testCase._id);

      // Create the problem with the test case references
      const newProblem = new Problem({
          problemName,
          problemStatement,
          difficulty,
          testCases: testCaseIds
      });

      await newProblem.save();

      return res.status(201).json({
          success: true,
          message: "Problem created successfully",
          problem: newProblem,
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          success: false,
          message: "Failed to create problem",
      });
  }
};

// Delete a problem (Admin only)
exports.deleteProblem = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedProblem = await Problem.findByIdAndDelete(id);

        if (!deletedProblem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Problem deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete problem",
        });
    }
};

// Get a single problem by ID
exports.getProblemById = async (req, res) => {
  try {
    const problemId = req.params.id.trim(); // Trim the ID to remove any extra whitespace or newlines
    const problem = await Problem.findById(problemId).populate('testCases');

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    return res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch problem",
    });
  }
};


//Update the existing problem based on the Id
exports.updateProblem = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { problemName, problemStatement, difficulty, testCases } = req.body;
    const problemId = req.params.id;

    // Find the problem by ID
    const problem = await Problem.findById(problemId).populate('testCases').session(session);

    if (!problem) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    // Update problem fields
    problem.problemName = problemName;
    problem.problemStatement = problemStatement;
    problem.difficulty = difficulty;

    // Handle test cases
    const updatedTestCases = [];
    for (const testCase of testCases) {
      if (testCase._id) {
        // Update existing test case
        const existingTestCase = await TestCase.findByIdAndUpdate(testCase._id, testCase, { new: true, session });
        updatedTestCases.push(existingTestCase._id);
      } else {
        // Create new test case
        const newTestCase = new TestCase(testCase);
        await newTestCase.save({ session });
        updatedTestCases.push(newTestCase._id);
      }
    }

    // Remove test cases that are not in the updated list
    const testCaseIdsToRemove = problem.testCases.filter(testCaseId => !updatedTestCases.includes(testCaseId));
    await TestCase.deleteMany({ _id: { $in: testCaseIdsToRemove } }).session(session);

    problem.testCases = updatedTestCases;

    await problem.save({ session });
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update problem",
    });
  }
};

