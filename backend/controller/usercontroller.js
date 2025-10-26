import usermodel from "../model/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";



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
  const { email, password, name, mobilenumber,state,district,soiltype} = req.body;
  console.log(req.body.name);
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

export { loginuser, registeruser };
