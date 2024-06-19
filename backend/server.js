import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js"

import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary} from "cloudinary";

dotenv.config();
//using we have connected our cloudnary account now we can Upload or Delete images
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

const PORT = process.env.PORT || 5000;

//to parse req.body then we have to use a middleware
app.use(express.json());
app.use(express.urlencoded({extended: true})); // To Parse the data , that we are sending in the THUNDER Client to check the Api

app.use(cookieParser()); // middleware to get the cookie
// console.log(process.env.MONGO_URI);

//Available Routes
//we will link the routes using app.use
//we are linking the data present at './routes/auth' to the 'localhost:8000/api/auth'
app.use("/api/auth" , authRoutes);
app.use("/api/users" , userRoutes);
app.use("/api/posts" , postRoutes);
app.use("/api/notifications" , notificationRoutes);


app.listen(PORT, ()=>{
    console.log(` Server is running on port ${PORT}`);
    connectMongoDB();
})