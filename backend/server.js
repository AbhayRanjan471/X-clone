import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

//to parse req.body then we have to use a middleware
app.use(express.json());
app.use(express.urlencoded({extended: true})); // To Parse the data , that we are sending in the THUNDER Client to check the Api

app.use(cookieParser()); // middleware to get the cookie
// console.log(process.env.MONGO_URI);

//Available Routes
//we will link the routes using app.use
//we are linking the data present at './routes/auth' to the 'localhost:8000/api/auth'
app.use("/api/auth" , authRoutes);


app.listen(PORT, ()=>{
    console.log(` Server is running on port ${PORT}`);
    connectMongoDB();
})