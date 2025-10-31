const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const winston = require("winston");
const multer = require("multer");
const path = require("path");

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

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});
const upload = multer({ dest: "uploads/" });

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Upload route
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    res.json({
      filename: req.file.filename,
      original: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
    });
    logger.info(`File uploaded: ${req.file.originalname}`);
  } catch (error) {
    logger.error(`Upload error: ${error.message}`);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Route for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Data structures
const userSockets = {}; // { userId: [socketId, ...] }
let chatUsers = {}; // { socketId: username }

// Broadcast online users for notifications
function broadcastOnlineUsers() {
  try {
    const onlineUsers = Object.keys(userSockets);
    io.emit("onlineUsers", onlineUsers);
    logger.info(`Broadcasted online users: ${onlineUsers.join(", ")}`);
  } catch (error) {
    logger.error(`Error broadcasting online users: ${error.message}`);
  }
}

// Broadcast chat user list
function broadcastChatUsers() {
  try {
    const users = Object.values(chatUsers);
    io.emit("chatUserList", users);
    logger.info(`Broadcasted chat users: ${users.join(", ")}`);
  } catch (error) {
    logger.error(`Error broadcasting chat users: ${error.message}`);
  }
}

io.on("connection", (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  // Notification app: Register user
  socket.on("register", (userId) => {
    try {
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

      logger.info(`✅ User ${trimmedUserId} registered for notifications`);
      broadcastOnlineUsers();
    } catch (error) {
      logger.error(`Error registering user: ${error.message}`);
    }
  });

  // Notification app: Send notification
  socket.on("sendNotification", ({ toUserId, message }) => {
    try {
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

  // Chat app: Set username
  socket.on("setUsername", (username) => {
    try {
      if (!username || typeof username !== "string") {
        logger.warn(`Invalid username provided: ${username}`);
        return;
      }
      const trimmedUsername = username.trim();
      if (!trimmedUsername) {
        logger.warn("Empty username after trimming");
        return;
      }

      chatUsers[socket.id] = trimmedUsername;
      socket.username = trimmedUsername;

      broadcastChatUsers();
      socket.broadcast.emit("publicMessage", {
        from: "System",
        message: `${trimmedUsername} joined the chat`,
        time: new Date().toLocaleTimeString(),
      });
      logger.info(`✅ User ${trimmedUsername} joined chat`);
    } catch (error) {
      logger.error(`Error setting username: ${error.message}`);
    }
  });

  // Chat app: Typing
  socket.on("typing", ({ to, isPrivate }) => {
    try {
      if (isPrivate && to) {
        const target = Object.keys(chatUsers).find((id) => chatUsers[id] === to);
        if (target) io.to(target).emit("typing", chatUsers[socket.id]);
      } else {
        socket.broadcast.emit("typing", chatUsers[socket.id]);
      }
    } catch (error) {
      logger.error(`Error handling typing: ${error.message}`);
    }
  });

  socket.on("stopTyping", ({ to, isPrivate }) => {
    try {
      if (isPrivate && to) {
        const target = Object.keys(chatUsers).find((id) => chatUsers[id] === to);
        if (target) io.to(target).emit("stopTyping", chatUsers[socket.id]);
      } else {
        socket.broadcast.emit("stopTyping", chatUsers[socket.id]);
      }
    } catch (error) {
      logger.error(`Error handling stop typing: ${error.message}`);
    }
  });

  // Chat app: Public message
  socket.on("publicMessage", (message) => {
    try {
      io.emit("publicMessage", {
        from: chatUsers[socket.id],
        message,
        time: new Date().toLocaleTimeString(),
      });
      logger.info(`Public message from ${chatUsers[socket.id]}: ${message}`);
    } catch (error) {
      logger.error(`Error sending public message: ${error.message}`);
    }
  });

  // Chat app: Private message
  socket.on("privateMessage", ({ to, message }) => {
    try {
      const target = Object.keys(chatUsers).find((id) => chatUsers[id] === to);
      if (target) {
        io.to(target).emit("privateMessage", {
          from: chatUsers[socket.id],
          message,
          time: new Date().toLocaleTimeString(),
        });
        logger.info(`Private message from ${chatUsers[socket.id]} to ${to}: ${message}`);
      }
    } catch (error) {
      logger.error(`Error sending private message: ${error.message}`);
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    try {
      // Notification app cleanup
      const userId = socket.userId;
      if (userId && userSockets[userId]) {
        userSockets[userId] = userSockets[userId].filter((sid) => sid !== socket.id);
        if (userSockets[userId].length === 0) delete userSockets[userId];
        broadcastOnlineUsers();
        logger.info(`❌ User ${userId} disconnected from notifications`);
      }

      // Chat app cleanup
      const username = chatUsers[socket.id];
      if (username) {
        delete chatUsers[socket.id];
        broadcastChatUsers();
        socket.broadcast.emit("publicMessage", {
          from: "System",
          message: `${username} left the chat`,
          time: new Date().toLocaleTimeString(),
        });
        logger.info(`❌ User ${username} left chat`);
      }
    } catch (error) {
      logger.error(`Error handling disconnect: ${error.message}`);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
