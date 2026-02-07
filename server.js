import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server
const httpServer = createServer(app);

/* ---------------- FOOD GET APIs ---------------- */
// 1️⃣ Get All Foods
app.get("/food", (req, res) => {
  res.json([
    { id: 1, name: "Pizza", category: "Fast Food", price: 299 },
    { id: 2, name: "Burger", category: "Fast Food", price: 199 },
    { id: 3, name: "Biryani", category: "Indian", price: 249 },
    { id: 4, name: "Pasta", category: "Italian", price: 279 },
    { id: 5, name: "Dosa", category: "South Indian", price: 149 },
  ]);
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to My Express API 🚀",
    app: "Testing Backend Railway App",
    version: "1.0.0",
    server: "HTTP Server"
  });
});

// Listen using HTTP server instead of app
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for use in other files
export { httpServer, app };