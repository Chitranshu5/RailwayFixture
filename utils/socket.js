// import { Server } from "socket.io";
// import { createServer } from "http";
// import express from "express";

// const app = express();
// const server = createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:5173",
//       "https://jolly-concha-8b60c6.netlify.app"
//     ],
//     credentials: true,
//   },
// });

// // Store online users
// const userSocketMap = {}; // {userId: socketId}

// // Get receiver socket ID helper
// export function getReceiverSocketId(userId) {
//   return userSocketMap[userId];
// }

// // Socket.IO connection handler
// io.on("connection", (socket) => {
//   console.log("✅ User connected:", socket.id);
  
//   const userId = socket.handshake.query.userId;
  
//   if (userId && userId !== "undefined") {
//     userSocketMap[userId] = socket.id;
    
//     // Emit updated online users list
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   }
  
//   // Handle disconnect
//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected:", socket.id);
    
//     if (userId) {
//       delete userSocketMap[userId];
      
//       // Emit updated online users list
//       io.emit("getOnlineUsers", Object.keys(userSocketMap));
//     }
//   });
// });

// export { io, app, server };