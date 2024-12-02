import express from "express";
import { fileURLToPath } from "url"; // Import fileURLToPath to get the current file path
import path from "path"; // For serving the HTML file
import generateImage from "./generate-image.js";
import cors from "cors";
import publicIp from "public-ip";


//Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Get the current directory path (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the public IP address of the server
const ip = await publicIp.v4();



// Serve the frontend `index.html` file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "main.html")); 
});

// Handle the image generation
app.post("/generate-image", async (req, res) => {
  const { prompt } = req.body; // Get the user input from the frontend
  await generateImage(prompt, res, __dirname);
});

// Start the server
app.listen(3001, "0.0.0.0", () => console.log("Server running on http://",ip,":3001"));
