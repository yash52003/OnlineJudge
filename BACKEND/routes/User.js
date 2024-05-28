const express = require("express");
const router = express.Router();


const {login , signup , logout} = require("../controllers/Auth");
const {auth , isAdmin , isUser } = require("../middlewares/Auth");

router.post("/login" , login);
router.post("/signup" , signup);
router.post("/logout", logout);

// router.get("/loggedIn" , auth , (req , res) => {
//     res.json({
//         success : true,
//         message : "Welcome you are successfully logged in and can access the courses Now",
//     })
// })

router.get("/user" , auth , isUser , (req , res) => {
    res.json({
        success : true,
        message : "Welcome to the protected route for the User",
    })
})

router.get("/admin" , auth , isAdmin , (req , res) => {
    res.json({
        success : true,
        message : "Welcome to the protected route for the admin",
    })
})

module.exports = router;