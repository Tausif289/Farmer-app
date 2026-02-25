import express from "express";
import { forgotPassword, loginuser,registeruser, resetPassword, } from "../controller/usercontroller.js";
import userAuth from "../middleware/auth.js";

const userrouter=express.Router();

//user api endpoint
userrouter.post("/register", registeruser);
userrouter.post("/login", loginuser);
userrouter.post("/forgot-password", forgotPassword);
userrouter.post("/reset-password/:token", resetPassword);
export default userrouter;
