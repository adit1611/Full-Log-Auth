import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from './db/connection.js';
import authRoutes from './routes/auth.route.js';
import path from 'path';

dotenv.config();




const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({origin: "http://localhost:5174", credentials:true}))

app.use(express.json()); 
app.use(cookieParser());

// app.get("/", (req,res) => {
//     res.send("Hello World!");
// })

app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/Frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
	});
}

app.listen(PORT,() => {
    connectDB();
    console.log("Server is running on port 5000");
    
});