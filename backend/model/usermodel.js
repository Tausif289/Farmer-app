import mongoose from "mongoose";
const userschema = new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
       name: {
        type: String,
        required: true,
      },
       mobilenumber: {
        type: Number,
        required: true,
      },
       state: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      soiltype: {
        type: String,
        required: true,
      },
    }
  );

const usermodel = mongoose.model.user || mongoose.model("user", userschema);
export default usermodel;