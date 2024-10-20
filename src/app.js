import express from "express"
import cors from "cors"


const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.F_PORT,
    credentials: true,
}))


// Imports Routes

import userRoutes from "./routes/post.route.js";

app.use("/api/v1/post", userRoutes);



export default app;
