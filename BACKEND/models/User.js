const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required : true,
    },

    password:{
        type:String,
        required:true,
    },

    email:{
        type:String,
        required:true,
    },

    role:{
        type:String,
        enum: ['Admin' , 'User'],
        required:true,
    },

    ProblemList: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Problem",
        }
    ],

});

module.exports = mongoose.model("User" , userSchema);
