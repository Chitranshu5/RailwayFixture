// import express from "express";
// import dotenv from "dotenv";
// import { createServer } from "http";
// import { connectDB } from "./modal/db.js";
// import userRoutes from "./routes/user.routes.js"
// import cookieParser from "cookie-parser"; // Add this

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;
// const httpServer = createServer(app);
// app.use(express.json());
// app.use(cookieParser()); // Add this to parse cookies


// // Routes
// app.use("/api/users", userRoutes); // Add this route



// app.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Welcome to My Express API 🚀",
//     app: "Testing Backend Railway App",
//     version: "1.0.0"
//   });
// });

// // Connect to database and start server
// connectDB()
//   .then(() => {
//     httpServer.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Failed to connect to database:", error);
//     process.exit(1);
//   });

// export { httpServer, app };


import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io"; // Add this
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import { connectDB } from "./modal/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer);

// Store online users
const userSocketMap = {}; // {userId: socketId}

// Get receiver socket ID helper
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    // Emit updated online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    if (userId) {
      delete userSocketMap[userId];
      // Emit updated online users list
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);

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

export { httpServer, app, io };