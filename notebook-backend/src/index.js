import express from "express";
import bodyParser from "body-parser";
import healthRouter from "./routes/health.js";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

app.get("/health", healthRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
