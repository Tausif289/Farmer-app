import usermodel from "../model/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import crypto from "crypto";
import nodemailer from "nodemailer";



const loginuser= async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "user dose not exists",
      });
    }
    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) {
      return res.json({
        success: false,
        message: "invalid password",
      });
    }
    const token = createtoken(user._id);
    res.json({
      success: true,
      token,
      name:user.name,email:user.email,mobilenumber:user.mobilenumber,state:user.state,district:user.district,soiltype:user.soiltype
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Error",
    });
  }
};

//create token
const createtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};


//register user
const registeruser = async (req, res) => {
  const { email, password, name, mobilenumber,state,district,soiltype} = req.body;;
  try {
    if(!name || !email || !password|| !mobilenumber || !state || !district || !soiltype){
        return (
            res.json({
            success:false,
            message:"missing details"
         }))
    }
    const exists = await usermodel.findOne({ email });
    if (exists) {
      return res.json({
        success: false,
        message: "user already exists",
      });
    }
    // validating email format & password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter valid message",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }
    //hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const newuser = new usermodel({
      email: email,  
      name: name,
      password: hashedpassword,
      mobilenumber:mobilenumber,
      state:state,
      district:district,
      soiltype:soiltype,
    });

    const user = await newuser.save();
    console.log(user)
    const token = createtoken(user._id);
    res.json({
      success: true,
      token,
      name:user.name,email:user.email,mobilenumber:user.mobilenumber,state:user.state,district:user.district,soiltype:user.soiltype
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Error",
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found with this email",
      });
    }

    // Create reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving to DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    console.log("Reset Token (sent in email):", resetToken);
console.log("Hashed Token (stored in DB):", hashedToken);
    await user.save();

    // Create reset URL
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // Setup mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASS);
    const message = `
      You requested a password reset.
      Click here to reset your password:
      ${resetUrl}
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      text: message,
    });

    res.json({
      success: true,
      message: "Reset link sent to your email",
    });

  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Email could not be sent",
    });
  }
};


const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await usermodel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });

  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export { loginuser, registeruser, forgotPassword, resetPassword };
