//Creating the sever
const express = require("express");
const app = express();
const cors = require('cors');

//Loading the dotenv file and deciding the PORT_NO
require('dotenv').config();
const PORT = process.env.PORT || 4000;

//Establishing the middlewares
app.use(cors());
app.use(express.json());

//We will also use cookie for authorisation -- Cookie - Parser middleware
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//Importing the db function and connecting to the database
require("./config/database").connect();

//Mouting the main route for the user
const user = require("./routes/User");
app.use("/api/v1" , user);

//Mouting the main route for the problem
const problemRoutes = require("./routes/Problem");
app.use("/api/v1/problems" , problemRoutes);

//Making theapplisten on the PORT
app.listen(PORT , () => {
    console.log(`App is listening at the PORT ${PORT}`)
})