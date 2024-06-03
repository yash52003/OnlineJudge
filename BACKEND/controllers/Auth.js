//I want to write the login and signup handler functions for authentication 
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = async (req , res) => {
    try{
        //Get the data from the request
        console.log(req.body);
        const {name ,  email , password , role} = req.body;

        //Doing the validation for the email and the password
        if(!email || !password || !name){
            return res.status(400).json({
                success : false,
                message : "Please fill the details carefully",
            });
        }

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
            name , email , role ,  password : hashPassword , ProblemList : [],
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

//Step2 - now need to write the login handler function
exports.login = async (req , res) => {
    try{
        //Step1 - Fetching the data from the request body -> Destructuring of the object into the variables 
        const {email , password} = req.body;

        //Do the validation 
        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : "Please fill out the details properly",
            });
        }

        //Cheak if the user is already present or not - Cheak that on the basis of the email unique parameter that the entry is present in the database or not 

        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success : false,
                message : "Not a signedin user First Signin then come to the login page",
            })
        }

        //Now we need to return a token to the user for the purpose of authorisation 
        //Step : Verify Password and then generate the jwt token
        const payload = {
            email : user.email,
            name : user.name,
            //Mongodb id is unique for each user
            id : user._id,
            role : user.role,
        }

        if(await bcrypt.compare(password , user.password)){
            //If the password matches 

            //For generating the jwt token we need the three things payload , JWT_SECRET , options {expiresIn : "2h"}
            const token = jwt.sign(payload , process.env.JWT_SECRET , {
                expiresIn : "2h",
            });

            //Now the token is created
            //We create a new field named token in the userObject as we need to send it to the User we need to restrict the password if he is an hacker
            user = user.toObject();
            user.token = token;
            user.password = undefined;


            //We will send a cookie to the user for the purpose of the authentication and authorisation
            //{cookieName , cookie , options}
            //In options we generally pass the expiryTime of the cookie 
            const options = {
                expires : new Date(Date.now() + 3 * 60 * 60 * 24 * 1000),
                httpOnly : true,
            }



            res.cookie("token" , token , options).status(200).json({
                success : true,
                token,
                user,
                message : "User logged in Successfully",
            });


        }else{
            //If the password doesn't matches 
            return res.status(403).json({
                success : false,
                message : "Password Incorrect",
            })
        }    

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Login Failure",
        });
    }
}

//Writing the logout handler function
exports.logout = (req, res) => {
    res.clearCookie("token").status(200).json({
        success: true,
        message: "User logged out successfully",
    });
};