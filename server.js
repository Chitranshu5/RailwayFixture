import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for testing
    methods: ["GET", "POST"]
  }
});

/* ---------------- Socket.IO Implementation ---------------- */
io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);
  
  // Send user ID to the client
  socket.emit("welcome", {
    message: "Welcome to the server!",
    userId: socket.id,
    timestamp: new Date().toISOString()
  });

  // Listen for custom messages
  socket.on("message", (data) => {
    console.log(`Message from ${socket.id}:`, data);
    io.emit("message", { userId: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

/* ---------------- FOOD GET APIs ---------------- */
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
    socketIO: "enabled"
  });
});

// Serve test page
app.get("/test", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Socket.IO Test</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          max-width: 600px;
          width: 100%;
        }
        h1 {
          color: #667eea;
          margin-bottom: 30px;
          text-align: center;
        }
        .status {
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 20px;
          text-align: center;
          font-weight: bold;
        }
        .connected {
          background: #d4edda;
          color: #155724;
          border: 2px solid #c3e6cb;
        }
        .disconnected {
          background: #f8d7da;
          color: #721c24;
          border: 2px solid #f5c6cb;
        }
        .user-id {
          background: #e7f3ff;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
          border-left: 4px solid #667eea;
        }
        .user-id strong {
          color: #667eea;
          font-size: 14px;
        }
        .user-id p {
          font-family: 'Courier New', monospace;
          font-size: 16px;
          margin-top: 10px;
          color: #333;
          word-break: break-all;
        }
        .message-box {
          margin-top: 30px;
        }
        input {
          width: 100%;
          padding: 15px;
          border: 2px solid #ddd;
          border-radius: 10px;
          font-size: 16px;
          margin-bottom: 10px;
          transition: border 0.3s;
        }
        input:focus {
          outline: none;
          border-color: #667eea;
        }
        button {
          width: 100%;
          padding: 15px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
        }
        button:hover {
          background: #5568d3;
        }
        .messages {
          margin-top: 20px;
          max-height: 300px;
          overflow-y: auto;
          background: #f8f9fa;
          padding: 15px;
          border-radius: 10px;
        }
        .message-item {
          padding: 10px;
          margin: 5px 0;
          background: white;
          border-radius: 5px;
          border-left: 3px solid #667eea;
        }
        .message-item small {
          color: #999;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Socket.IO Test Page</h1>
        
        <div id="status" class="status disconnected">
          ⚠️ Disconnected
        </div>
        
        <div class="user-id">
          <strong>Your User ID:</strong>
          <p id="userId">Waiting for connection...</p>
        </div>
        
        <div class="message-box">
          <input type="text" id="messageInput" placeholder="Type a message...">
          <button onclick="sendMessage()">Send Message</button>
        </div>
        
        <div class="messages" id="messages"></div>
      </div>

      <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
      <script>
        // Connect to Socket.IO server
        const socket = io();

        // Connection event
        socket.on("connect", () => {
          console.log("Connected to server!");
          document.getElementById("status").className = "status connected";
          document.getElementById("status").textContent = "✅ Connected";
          document.getElementById("userId").textContent = socket.id;
        });

        // Welcome event
        socket.on("welcome", (data) => {
          console.log("Welcome data:", data);
          addMessage(\`Server: \${data.message}\`, data.userId);
        });

        // Disconnect event
        socket.on("disconnect", () => {
          console.log("Disconnected from server!");
          document.getElementById("status").className = "status disconnected";
          document.getElementById("status").textContent = "⚠️ Disconnected";
          document.getElementById("userId").textContent = "Disconnected";
        });

        // Receive messages
        socket.on("message", (data) => {
          addMessage(data.text, data.userId);
        });

        // Send message function
        function sendMessage() {
          const input = document.getElementById("messageInput");
          const text = input.value.trim();
          
          if (text) {
            socket.emit("message", { text });
            input.value = "";
          }
        }

        // Add message to UI
        function addMessage(text, userId) {
          const messagesDiv = document.getElementById("messages");
          const messageItem = document.createElement("div");
          messageItem.className = "message-item";
          messageItem.innerHTML = \`
            <div>\${text}</div>
            <small>User: \${userId}</small>
          \`;
          messagesDiv.appendChild(messageItem);
          messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        // Allow Enter key to send message
        document.getElementById("messageInput").addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Listen using HTTP server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test page: http://localhost:${PORT}/test`);
});

export { httpServer, app, io };