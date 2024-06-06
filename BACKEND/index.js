//Creating the sever
const express = require("express");

//Loading the dotenv file and deciding the PORT_NO
require('dotenv').config();
const PORT = process.env.PORT || 4000;

//Establising the middlewares
const app = express();
app.use(express.json());

//Making cors
const cors = require('cors');
app.use(cors());

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
app.use("/api/v2" , problemRoutes);

app.get

//Making theapplisten on the PORT
app.listen(PORT , () => {
    console.log(`App is listening at the PORT ${PORT}`)
})