import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import healthRouter from "./routes/health.js";
import notebookRouter from "./routes/notebooks.js";

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;

if (!DB_URI) {
    console.error("DB_URI is not defined in environment variables");
    process.exit(1);
}

const app = express();
app.use(bodyParser.json());

app.use("/health", healthRouter);
app.use("/", notebookRouter);

async function start() {
    try {
        await mongoose.connect(DB_URI);
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }

    console.log("Connected to the database");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

start();
