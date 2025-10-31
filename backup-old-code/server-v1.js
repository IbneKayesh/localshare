const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

let users = {}; // { socketId: username }

// Upload route
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    filename: req.file.filename,
    original: req.file.originalname,
    url: `/uploads/${req.file.filename}`,
  });
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("setUsername", (username) => {
    users[socket.id] = username;
    io.emit("userList", Object.values(users));
    socket.broadcast.emit("publicMessage", {
      from: "System",
      message: `${username} joined the chat`,
      time: new Date().toLocaleTimeString(),
    });
  });

  socket.on("typing", ({ to, isPrivate }) => {
    if (isPrivate && to) {
      const target = Object.keys(users).find((id) => users[id] === to);
      if (target) io.to(target).emit("typing", users[socket.id]);
    } else {
      socket.broadcast.emit("typing", users[socket.id]);
    }
  });

  socket.on("stopTyping", ({ to, isPrivate }) => {
    if (isPrivate && to) {
      const target = Object.keys(users).find((id) => users[id] === to);
      if (target) io.to(target).emit("stopTyping", users[socket.id]);
    } else {
      socket.broadcast.emit("stopTyping", users[socket.id]);
    }
  });

  socket.on("publicMessage", (message) => {
    io.emit("publicMessage", {
      from: users[socket.id],
      message,
      time: new Date().toLocaleTimeString(),
    });
  });

  socket.on("privateMessage", ({ to, message }) => {
    const target = Object.keys(users).find((id) => users[id] === to);
    if (target) {
      io.to(target).emit("privateMessage", {
        from: users[socket.id],
        message,
        time: new Date().toLocaleTimeString(),
      });
    }
  });

  socket.on("disconnect", () => {
    const name = users[socket.id];
    delete users[socket.id];
    io.emit("userList", Object.values(users));
    if (name) {
      socket.broadcast.emit("publicMessage", {
        from: "System",
        message: `${name} left the chat`,
        time: new Date().toLocaleTimeString(),
      });
    }
  });
});

server.listen(3000, () => console.log("✅ Server running: http://localhost:3000"));
