const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const winston = require("winston");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Set up Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "server.log" })
  ]
});

// Track sockets per user
const userSockets = {}; // { userId: [socketId, socketId, ...] }

// Broadcast online users
function broadcastOnlineUsers() {
  try {
    const onlineUsers = Object.keys(userSockets);
    io.emit("onlineUsers", onlineUsers);
    logger.info(`Broadcasted online users: ${onlineUsers.join(", ")}`);
  } catch (error) {
    logger.error(`Error broadcasting online users: ${error.message}`);
  }
}

io.on("connection", (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  // User registers (after login)
  socket.on("register", (userId) => {
    try {
      // Input validation: trim and check non-empty
      if (!userId || typeof userId !== "string") {
        logger.warn(`Invalid userId provided: ${userId}`);
        return;
      }
      const trimmedUserId = userId.trim();
      if (!trimmedUserId) {
        logger.warn("Empty userId after trimming");
        return;
      }

      if (!userSockets[trimmedUserId]) userSockets[trimmedUserId] = [];
      userSockets[trimmedUserId].push(socket.id);
      socket.userId = trimmedUserId;

      logger.info(`✅ User ${trimmedUserId} connected`);
      broadcastOnlineUsers();
    } catch (error) {
      logger.error(`Error registering user: ${error.message}`);
    }
  });

  // Send notification to a specific user
  socket.on("sendNotification", ({ toUserId, message }) => {
    try {
      // Input validation for toUserId
      if (!toUserId || typeof toUserId !== "string") {
        logger.warn(`Invalid toUserId provided: ${toUserId}`);
        return;
      }
      const trimmedToUserId = toUserId.trim();
      if (!trimmedToUserId) {
        logger.warn("Empty toUserId after trimming");
        return;
      }

      if (userSockets[trimmedToUserId]) {
        userSockets[trimmedToUserId].forEach((sid) => {
          io.to(sid).emit("notification", {
            from: socket.userId,
            message,
            time: new Date(),
          });
        });
        logger.info(`Notification sent from ${socket.userId} to ${trimmedToUserId}: ${message}`);
      } else {
        logger.warn(`Attempted to send notification to non-existent user: ${trimmedToUserId}`);
      }
    } catch (error) {
      logger.error(`Error sending notification: ${error.message}`);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    try {
      const userId = socket.userId;
      if (userId && userSockets[userId]) {
        userSockets[userId] = userSockets[userId].filter((sid) => sid !== socket.id);
        if (userSockets[userId].length === 0) delete userSockets[userId];

        logger.info(`❌ User ${userId} disconnected`);
        broadcastOnlineUsers();
      }
    } catch (error) {
      logger.error(`Error handling disconnect: ${error.message}`);
    }
  });
});

// Route for root path to serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
