const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({

    problemName:{
        type : String,
        required : true,
        trim : true,
    },

    problemStatement:{
        type: String,
        required: true,
    },

    testCases : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "TestCase",
        }
    ],

    difficulty:{
        type: String,
        enum : ['Hard' , 'Medium' , 'Easy'],
        required : true,
    },

});

module.exports = mongoose.model("Problem" , problemSchema);
