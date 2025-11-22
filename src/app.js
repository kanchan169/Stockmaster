import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";





const app = express();

app.use("/dashboard", dashboardRoutes);
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);

export default app;
