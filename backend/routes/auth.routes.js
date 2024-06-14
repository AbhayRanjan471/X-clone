import express from "express";
import { signup } from "../controllers/auth.controller.js";
import { login } from "../controllers/auth.controller.js";
import { logout } from "../controllers/auth.controller.js";

const router = express.Router();

//Get The Request
//ROUTE 1: Signup: POST "/api/auth/signup". 
//All the necessary functionality are written in auth.controller.js
router.post("/signup", signup);

//ROUTE 2: login: POST "/api/auth/login". 
router.post("/login", login);

//ROUTE 2: logout: POST "/api/auth/logout". 
router.post("/logout", logout);

export default router;

