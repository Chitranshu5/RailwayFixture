import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { connectDB } from "./modal/db.js";
import userRoutes from "./routes/user.routes.js"
import cookieParser from "cookie-parser"; // Add this

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);
app.use(express.json());
app.use(cookieParser()); // Add this to parse cookies


// Routes
app.use("/api/users", userRoutes); // Add this route



app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to My Express API 🚀",
    app: "Testing Backend Railway App",
    version: "1.0.0"
  });
});

// Connect to database and start server
connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  });

export { httpServer, app };