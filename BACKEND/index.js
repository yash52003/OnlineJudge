//Creating the sever
const express = require("express");
const app = express();

//Loading the dotenv file and deciding the PORT_NO
require('dotenv').config();
const PORT = process.env.PORT || 4000;

//Establishing the middlewares
app.use(express.json());

//We will also use cookie for authorisation -- Cookie - Parser middleware
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//Importing the db function and connecting to the database
require("./config/database").connect();

//Mouting the main route for the user
const user = require("./routes/User");
app.use("/api/v1" , user);

//Making theapplisten on the PORT

app.listen(PORT , () => {
    console.log(`App is listening at the PORT ${PORT}`)
})