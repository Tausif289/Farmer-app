import mongoose from "mongoose";

const cropSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String },
    email: { type: String },
    cropType: { type: String, required: true },
    fertilizerUsed: { type: String, required: true },
    pestUsed: { type: String, required: true },
    lastFertilizingDate: { type: Date },  
    lastPestDate: { type: Date },
  },
  { timestamps: true }
);

const cropmodel= mongoose.model("Crop", cropSchema);
export default cropmodel;