import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
const frontendPath = path.join(__dirname, "../../frontend");
app.use(express.static(frontendPath));

// API Routes
app.use("/api", router);

export default app;
