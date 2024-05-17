const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    userId:{
        type : String,
        required : true,
        unique : true,
        trim : true,
    },

    password:{
        type:String,
        required:true,
    },

    confirmPassword:{
        type:String,
        required:true,
    },

    email:{
        type:String,
        required:true,
    },

    DOB:{
        type: String,
        required: true,
    },

    firstName:{
        type: String,
        required : true,
    },

    lastName:{
        type : String,
        required : true,
    },

    ProblemList: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Problem",
        }
    ],

});


module.exports = mongoose.model("User" , userSchema);
