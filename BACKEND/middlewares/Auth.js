const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req , res , next) => {
    try{   
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer " , "");
        console.log(token);
        //If the token is missing return the response
        if(!token){
            return res.status(401).json({
                success : false,
                message : "Token is missing",
            });
        }

        //If we have the token then just verify it.We verify the token on the basis of the SECRET_KEY that we used at the time of signing
        try{
            console.log(process.env.JWT_SECRET);
            const decode = await jwt.verify(token , process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }catch(error){
            //Verification status failed as the token was invalid
            return res.status(401).json({
                success : false,
                message : "Token is Invalid",
            });
        }

        next();
    }catch(error){

        return res.status(401).json({
            success : false,
            message : "Something went wrong while validation of the token",
        })

    }

}

exports.isAdmin = (req , res , next) => {
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success : false,
                message : "This is the protected route for the Admins only"
            })
        }
    }catch(error){
        res.status(500).json({
            success : false,
            message : "User role cannot be verified , please try again",
        });
    }
    //Call the next handler function
    next();
}

exports.isUser = (req , res , next) => {
    try{
        if(req.user.role !== "User"){
            return res.status(401).json({
                success : false,
                message : "This is the protected route for the Admins only"
            })
        }
    }catch(error){
        res.status(500).json({
            success : false,
            message : "User role cannot be verified , please try again",
        });
    }
    //Call the next handler function
    next();
}




