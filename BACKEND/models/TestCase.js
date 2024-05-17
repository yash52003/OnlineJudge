const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({

    problem : {
        type :mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Problem",
    },

    input : {
        type : String,
        required : true,
    },

    output : {
        type : String,
        required : true,
    },

});

module.exports = mongoose.model("TestCase" , testCaseSchema);

