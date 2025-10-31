const socket = io();
let username, chatTarget = null, isPrivate = false;

// Request notification permission on load
if ('Notification' in window) {
  Notification.requestPermission();
}

// Load messages from localStorage for a specific chat target
function loadMessages(chatTarget = null) {
  const key = chatTarget ? `chatMessages_${chatTarget}` : 'chatMessages_public';
  const messages = JSON.parse(localStorage.getItem(key) || '[]');
  document.getElementById("messages").innerHTML = "";
  messages.forEach(msg => addMessage(msg.from, msg.message, msg.time));
}

// Save message to localStorage for a specific chat target
function saveMessage(from, message, time, chatTarget = null) {
  const key = chatTarget ? `chatMessages_${chatTarget}` : 'chatMessages_public';
  const messages = JSON.parse(localStorage.getItem(key) || '[]');
  messages.push({ from, message, time });
  localStorage.setItem(key, JSON.stringify(messages));
}

document.getElementById("joinBtn").onclick = () => {
  username = document.getElementById("username").value.trim();
  if (!username) return alert("Enter name");
  socket.emit("setUsername", username);
  document.getElementById("userDisplay").textContent = username;
  document.getElementById("login").style.display = "none";
  document.getElementById("chat").style.display = "flex";
  loadMessages(); // Load public messages initially
};

socket.on("userList", (list) => {
  const ul = document.getElementById("users");
  ul.innerHTML = "";
  document.getElementById("userCount").textContent = list.length;
  list.filter(u => u !== username).forEach(u => {
    const li = document.createElement("li");
    li.textContent = u;
    li.onclick = () => {
      chatTarget = u;
      isPrivate = true;
      document.getElementById("chatHeader").textContent = `Private Chat with ${u}`;
      loadMessages(u); // Load private messages for this user
    };
    ul.appendChild(li);
  });
});

document.getElementById("publicBtn").onclick = () => {
  chatTarget = null;
  isPrivate = false;
  document.getElementById("chatHeader").textContent = "Public Chat";
  loadMessages(); // Load public messages
};

document.getElementById("clearHistory").onclick = () => {
  if (confirm("Are you sure you want to clear the chat history?")) {
    const key = chatTarget ? `chatMessages_${chatTarget}` : 'chatMessages_public';
    localStorage.removeItem(key);
    document.getElementById("messages").innerHTML = "";
  }
};

document.getElementById("send").onclick = sendMessage;
document.getElementById("message").addEventListener("keydown", () => socket.emit("typing", { to: chatTarget, isPrivate }));
document.getElementById("message").addEventListener("keyup", () => {
  clearTimeout(window.typingTimeout);
  window.typingTimeout = setTimeout(() => socket.emit("stopTyping", { to: chatTarget, isPrivate }), 1000);
});

socket.on("typing", (from) => {
  document.getElementById("typing").textContent = `${from} is typing...`;
});

socket.on("stopTyping", () => {
  document.getElementById("typing").textContent = "";
});

function sendMessage() {
  const msg = document.getElementById("message").value;
  if (!msg) return;

  const time = new Date().toLocaleTimeString();
  if (isPrivate && chatTarget) {
    socket.emit("privateMessage", { to: chatTarget, message: msg });
    addMessage(`You → ${chatTarget}`, msg, time);
    saveMessage(`You → ${chatTarget}`, msg, time, chatTarget); // Save sent private message
  } else {
    socket.emit("publicMessage", msg);
    addMessage("You", msg, time);
    saveMessage("You", msg, time); // Save sent public message
  }
  document.getElementById("message").value = "";
}

socket.on("privateMessage", ({ from, message, time }) => {
  addMessage(`${from} (private)`, message, time);
  saveMessage(`${from} (private)`, message, time, from); // Save under sender's key for consistency
  if (from !== username && Notification.permission === 'granted') {
    new Notification(`Private message from ${from}`, { body: message });
  }
});
socket.on("publicMessage", ({ from, message, time }) => {
  addMessage(from, message, time);
  saveMessage(from, message, time); // Public messages
  if (from !== username && !isPrivate && Notification.permission === 'granted') {
    new Notification(`Public message from ${from}`, { body: message });
  }
});

function addMessage(from, msg, time) {
  const div = document.getElementById("messages");
  const p = document.createElement("p");
  p.innerHTML = `<b>${from}</b> [${time}]: ${msg}`;
  div.appendChild(p);
  div.scrollTop = div.scrollHeight;
}

// --- File upload ---
const form = document.getElementById("uploadForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("Select a file first");
  const data = new FormData();
  data.append("file", file);
  const res = await fetch("/upload", { method: "POST", body: data });
  const json = await res.json();
  const fileLink = `<a href="${json.url}" target="_blank" download="${json.original}">${json.original}</a>`;
  const msg = `📎 File shared: ${fileLink}`;
  
  if (isPrivate && chatTarget) {
    socket.emit("privateMessage", { to: chatTarget, message: msg });
    addMessage(`You → ${chatTarget}`, msg, new Date().toLocaleTimeString());
  } else {
    socket.emit("publicMessage", msg);
    addMessage("You", msg, new Date().toLocaleTimeString());
  }
});
