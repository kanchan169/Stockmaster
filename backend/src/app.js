import express from "express";
import cors from "cors";
import "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
import testRoutes from "./routes/testRoutes.js";
app.use("/api/test", testRoutes);

export default app;
