//I want to write the login and signup handler functions for authentication 

const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.signup = async (req , res) => {
    try{
        //Get the data from the request
        console.log(req.body);
        const {name ,  email , password } = req.body;

        //Cheak is the user already exists or not 
        const existingUser = await User.findOne({email});

        if(existingUser){
            //If a valid entry is present in the database then simply return 

            return res.status(400).json({
                success : false,
                message : "User already exists",
            });

        };

        //Existing user is need to do the signup for the protection purpose its always a good practice to hash the password 


        let hashPassword;
        try{

            hashPassword = await bcrypt.hash(password , 10);
            //10 represent the no of rounds 
        }catch(err){
            console.log(err);
            return res.status(500).json({
                success : false,
                message : "Error in hashing the password",
            })
        }


        //After hashing the password we need to create the entry in the database
        const user = await User.create({
            name , email ,  password : hashPassword , ProblemList : [],
        })

        return res.status(200).json({
            success : true,
            message : "User Created Success",
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User Cannot be registered please try again later"
        })
    }
}

// exports.login = async (req , res) => {

// }

//for the signup and login functionalities we need the interaction with the database therefore it will be asynchronouse function