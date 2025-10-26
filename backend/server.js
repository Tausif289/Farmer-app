import express from 'express';
import cors from 'cors'
import path from "path";
import connectToDatabase from './config/mongodb.js';
import 'dotenv/config'
import userrouter from './routes/userroute.js';
import multer from "multer";
import soilRoutes from './routes/soilRoute.js';
import croproutes from './routes/croproute.js';
import marketRoutes from "./routes/marketRoute.js";
import questionroutes from "./routes/questionroutes.js"
import translationRoutes from "./routes/translationroutes.js";
import { fileURLToPath } from "url";
import healthroute from './routes/healthroute.js';
import crophisroute from './routes/crophis.js';
import Feedback from "./routes/feedbackRoute.js"
const port=process.env.PORT||4000;
const app=express()

app.use(express.json({ limit: "50mb" }));
app.use(cors({
  origin: "http://localhost:5173", // or "*" to allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
// i18next initialization
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


connectToDatabase();
const storage = multer.memoryStorage();
const upload = multer({ dest: "uploads/" });
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use('/api/user',userrouter);
app.use("/api/soil", soilRoutes);
app.use('/api/crop',croproutes);
app.use("/api/marketprices", marketRoutes);
app.use("/api", questionroutes);
app.use("/api", translationRoutes);
app.use('/api/crops',crophisroute);
app.use('api/crop',healthroute);
app.use("/api",Feedback);

app.get("/",(req,res)=>{
    res.send("working")
});

app.listen(port,()=>{
    console.log("server is running on port ",port)
});