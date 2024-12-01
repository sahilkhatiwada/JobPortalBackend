import express from "express";
import dotenv from "dotenv";
import connectDB from "./DatabaseConfig/connect.db.js";
import userRoutes from "./Routes/user.routes.js";
import jobRoutes from "./Routes/job.routes.js";

dotenv.config();

const app = express();

// To make app understand json data
app.use(express.json());

// connect to database 
 await connectDB();


// Register routes will be here 

app.use(userRoutes);
app.use(jobRoutes)


//  Start the server

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
