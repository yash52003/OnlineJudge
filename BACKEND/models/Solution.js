const mongoose = require("mongoose");

const solutionSchema = new mongoose.Schema({

    user:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User",
    },
    
    problem:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Problem",
    },

    verdict: {
        type : String,
        enum: ['Accepted' , 'Wrong Answer' , 'Runtime Error' , 'Compilation Error'],
        required : true,
    },

    submittedAt: {
        type : Date,
        default : Date.now(),
    }

})

module.exports = mongoose.model("Solution" , solutionSchema);


