import express from "express";
import { loginuser,registeruser } from "../controller/usercontroller.js";
import userAuth from "../middleware/auth.js";

const userrouter=express.Router();

//user api endpoint
userrouter.post("/register", registeruser);
userrouter.post("/login", loginuser);

export default userrouter;
