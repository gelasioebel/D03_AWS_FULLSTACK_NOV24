// backend/server.ts
import express from "express";
import cors from "cors";
import routes from "./src/routes/route";
import path from "path";

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Static files (for documentation, if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use("/api", routes);

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to the Plants API. Use /api/health to check status.");
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`API started successfully!`);
    console.log(`Health check available at: http://localhost:${port}/api/health`);
});