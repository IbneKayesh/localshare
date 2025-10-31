// WhatsApp-like UI for Local Share
// Features: Login, Title bar with modes, Sidebar chat list, Main chat area, Search, Logout

let socket;
try {
  socket = io();
} catch (e) {
  console.error('Socket.io not loaded:', e);
  socket = null;
}
let currentUser = null;
let currentMode = 'public'; // 'public', 'private', 'notify'
let selectedUser = null;
let allMessages = [];
let filteredMessages = [];

// DOM Elements
const loginSection = document.getElementById('loginSection');
const app = document.getElementById('app');
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('usernameInput');
const currentUserSpan = document.getElementById('currentUser');
const logoutBtn = document.getElementById('logoutBtn');

// Title bar
const modePublic = document.getElementById('modePublic');
const modePrivate = document.getElementById('modePrivate');
const modeNotify = document.getElementById('modeNotify');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Sidebar
const chatList = document.getElementById('chatList');

// Chat area
const chatHeader = document.getElementById('chatHeader');
const chatMessages = document.getElementById('chatMessages');
const chatMessage = document.getElementById('chatMessage');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const typingIndicator = document.getElementById('typingIndicator');
const chatInputSection = document.getElementById('chatInputSection');
const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const filterBtn = document.getElementById('filterBtn');

// Auto-reconnect
if (socket) {
  socket.on('disconnect', () => {
    console.log('Disconnected, attempting to reconnect...');
    setTimeout(() => {
      socket.connect();
    }, 1000);
  });

  socket.on('connect', () => {
    console.log('Reconnected');
    if (currentUser) {
      socket.emit('register', currentUser);
    }
  });
}

// Login
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    if (username) {
      currentUser = username;
      localStorage.setItem('username', username);
      if (socket) {
        socket.emit('register', username);
      }
      loginSection.classList.add('d-none');
      app.classList.remove('d-none');
      currentUserSpan.textContent = username;
      updateUI();
    }
  });
}

// Logout
logoutBtn.addEventListener('click', () => {
  if (socket) {
    socket.emit('logout', currentUser);
  }
  localStorage.removeItem('username');
  currentUser = null;
  selectedUser = null;
  allMessages = [];
  filteredMessages = [];
  loginSection.classList.remove('d-none');
  app.classList.add('d-none');
  chatMessages.innerHTML = '';
  chatList.innerHTML = '';
});

// Mode switching
modePublic.addEventListener('click', () => setMode('public'));
modePrivate.addEventListener('click', () => setMode('private'));
modeNotify.addEventListener('click', () => setMode('notify'));

function setMode(mode) {
  currentMode = mode;
  selectedUser = null;
  document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('mode' + mode.charAt(0).toUpperCase() + mode.slice(1)).classList.add('active');
  updateUI();
}

// Update UI based on current state
function updateUI() {
  if (!currentUser) return;

  // Update chat list
  updateChatList();

  // Update chat header and input visibility
  if (currentMode === 'public') {
    chatHeader.textContent = 'Public Broadcast';
    chatInputSection.style.display = 'flex';
    uploadForm.style.display = 'flex';
  } else if (currentMode === 'private') {
    if (selectedUser) {
      chatHeader.textContent = `Chat with ${selectedUser}`;
      chatInputSection.style.display = 'flex';
      uploadForm.style.display = 'flex';
    } else {
      chatHeader.textContent = 'Select a user to chat privately';
      chatInputSection.style.display = 'none';
      uploadForm.style.display = 'none';
    }
  } else if (currentMode === 'notify') {
    chatHeader.textContent = 'Send Notifications';
    chatInputSection.style.display = 'flex';
    uploadForm.style.display = 'none';
  }

  loadMessages();
}

// Update chat list with online users
function updateChatList() {
  if (socket) {
    socket.emit('getOnlineUsers');
  }
}

if (socket) {
  socket.on('onlineUsers', (users) => {
    chatList.innerHTML = '';
    users.forEach(user => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="avatar ${user === currentUser ? 'online' : 'online'}">${user.charAt(0).toUpperCase()}</div>
        <div class="chat-info">
          <div class="name">${user}${user === currentUser ? ' (You)' : ''}</div>
          <div class="last-message">Online</div>
        </div>
      `;
      li.addEventListener('click', () => {
        if (currentMode === 'private') {
          selectedUser = user;
          updateUI();
        } else if (currentMode === 'notify') {
          selectedUser = user;
          updateUI();
        }
      });
      chatList.appendChild(li);
    });
  });
}

// Send message
sendMessageBtn.addEventListener('click', sendMessage);
chatMessage.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const message = chatMessage.value.trim();
  if (message && socket) {
    const msgData = {
      message,
      from: currentUser,
      to: selectedUser,
      mode: currentMode,
      time: new Date()
    };
    if (currentMode === 'notify') {
      socket.emit('sendNotification', { toUserId: selectedUser, message });
    } else {
      socket.emit('sendMessage', msgData);
    }
    chatMessage.value = '';
    allMessages.push(msgData);
    displayMessages();
  }
}

// Receive message
if (socket) {
  socket.on('message', (data) => {
    allMessages.push(data);
    displayMessages();
  });

  // Receive notification
  socket.on('notification', (data) => {
    alert(`🔔 From ${data.from}: ${data.message}`);
    const msgData = {
      message: `🔔 ${data.message}`,
      from: data.from,
      to: currentUser,
      mode: 'notify',
      time: data.time
    };
    allMessages.push(msgData);
    displayMessages();
  });
}

// Typing indicators
chatMessage.addEventListener('input', () => {
  if (socket) {
    socket.emit('typing', { user: currentUser, isTyping: chatMessage.value.length > 0 });
  }
});

if (socket) {
  socket.on('typing', (data) => {
    if (data.user !== currentUser) {
      typingIndicator.textContent = data.isTyping ? `${data.user} is typing...` : '';
    }
  });
}

// File upload
uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const file = fileInput.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('from', currentUser);
    formData.append('to', selectedUser);
    formData.append('mode', currentMode);

    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      const msgData = {
        message: `📎 File: ${data.filename}`,
        from: currentUser,
        to: selectedUser,
        mode: currentMode,
        fileUrl: data.url,
        time: new Date()
      };
      socket.emit('sendMessage', msgData);
      allMessages.push(msgData);
      displayMessages();
    });
  }
});

// Clear history
clearHistoryBtn.addEventListener('click', () => {
  allMessages = [];
  displayMessages();
});

// Search
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.toLowerCase();
  filteredMessages = allMessages.filter(msg =>
    msg.message.toLowerCase().includes(query) ||
    msg.from.toLowerCase().includes(query)
  );
  displayMessages(filteredMessages);
});

// Filter
filterBtn.addEventListener('click', () => {
  filteredMessages = allMessages.filter(msg => msg.from === currentUser);
  displayMessages(filteredMessages);
});

// Load and display messages
function loadMessages() {
  const relevantMessages = allMessages.filter(msg => {
    if (currentMode === 'public') {
      return msg.mode === 'public';
    } else if (currentMode === 'private' && selectedUser) {
      return msg.mode === 'private' && ((msg.from === currentUser && msg.to === selectedUser) || (msg.from === selectedUser && msg.to === currentUser));
    } else if (currentMode === 'notify') {
      return msg.mode === 'notify' && ((msg.from === currentUser && msg.to === selectedUser) || (msg.from === selectedUser && msg.to === currentUser));
    }
    return false;
  });
  displayMessages(relevantMessages);
}

function displayMessages(messages = null) {
  const msgs = messages || allMessages;
  chatMessages.innerHTML = '';
  msgs.forEach(msg => {
    const p = document.createElement('p');
    p.textContent = `${msg.from}: ${msg.message}`;
    if (msg.from === currentUser) {
      p.classList.add('own');
    }
    chatMessages.appendChild(p);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initialize
const savedUsername = localStorage.getItem('username');
if (savedUsername) {
  usernameInput.value = savedUsername;
}
