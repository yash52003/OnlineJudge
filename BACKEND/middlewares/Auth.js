const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req , res , next) => {
    try{
        //If the user is been loggen in we have returned a cookie with a token of the payload to him using that we are doing the authentication and the authorisation
        
        //Step1 -Extract the token ('There are 3 possible ways of sending the token and we have send the token in any of those possible ways')
        //Cookie , body , bearerToken
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer " , "");

        //If the token is missing return the response
        if(!token){
            return res.status(401).json({
                success : false,
                message : "Token is missing",
            });
        }

        //If we have the token then just verify it.We verify the token on the basis of the SECRET_KEY that we used at the time of signing
        try{
            const decode = await jwt.verify(token , process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }catch(error){
            //Verification status failed as the token was invalid
            return res.status(401).json({
                success : false,
                message : "Token is Invalid",
            })
        }

        next();
    }catch(error){

        return res.status(401).json({
            success : false,
            message : "Something went wrong while validation of the token",
        })

    }

}


//To decode the jwt token that we have send to the user response at the time of login we do it using the jwt.sign() method and to decode it we use the jwt.verify() method





