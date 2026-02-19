// =============================
// CONFIGURATION
// =============================
// IMPORTANT: Do NOT commit your API key. Create a local file `local-config.js`
// at the project root with the content:
//   window.GEMINI_API_KEY = 'your_api_key_here';
// That file is ignored by git (see .gitignore).
const API_KEY = window.GEMINI_API_KEY || 'REPLACE_WITH_YOUR_API_KEY';
const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

// =============================
// ELEMENTS
// =============================
const chatWrapper = document.getElementById("chat-wrapper");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const toggleBtn = document.getElementById("chat-toggle-btn");
const closeBtn = document.getElementById("close-btn");
const emojiBtn = document.getElementById("emoji-btn");
const emojiPicker = document.getElementById("emoji-picker");
const fileBtn = document.getElementById("file-btn");
const fileInput = document.getElementById("file-input");

// =============================
// TOGGLE CHAT VISIBILITY
// =============================
function toggleChatVisibility() {
  chatWrapper.classList.toggle("hidden");
  chatWrapper.classList.toggle("visible");
  if (!chatWrapper.classList.contains("hidden")) {
    userInput.focus();
  }
}

toggleBtn.addEventListener("click", toggleChatVisibility);
closeBtn.addEventListener("click", toggleChatVisibility);

// =============================
// EMOJI PICKER FUNCTIONALITY
// =============================
emojiBtn.addEventListener("click", () => {
  emojiPicker.classList.toggle("hidden");
});

// Insert emoji into input
document.querySelectorAll(".emoji-grid span").forEach(emoji => {
  emoji.addEventListener("click", () => {
    userInput.value += emoji.textContent;
    userInput.focus();
    emojiPicker.classList.add("hidden");
  });
});

// Close emoji picker when clicking outside
document.addEventListener("click", (e) => {
  if (e.target !== emojiBtn && e.target !== emojiPicker && !emojiPicker.contains(e.target)) {
    emojiPicker.classList.add("hidden");
  }
});

// =============================
// FILE UPLOAD FUNCTIONALITY
// =============================
fileBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const fileName = file.name;
    const fileSize = (file.size / 1024).toFixed(2);
    const fileMessage = `📎 File attached: ${fileName} (${fileSize}KB)`;
    userInput.value = fileMessage;
    userInput.focus();
    e.target.value = ""; // Reset file input
  }
});
sendBtn.addEventListener("click", handleSendMessage);

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSendMessage();
  }
});

// =============================
// MAIN FUNCTION
// =============================
async function handleSendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  showTypingIndicator();

  try {
    const response = await fetchGeminiResponse(message);
    removeTypingIndicator();
    addMessage(response, "bot");
  } catch (error) {
    removeTypingIndicator();
    const msg = error?.message || 'Unable to fetch response.';
    addMessage(`Error: ${msg}`, "bot");
    console.error('Chat error:', error);
  }
}

// =============================
// ADD MESSAGE TO UI
// =============================
function addMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.textContent = text;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// =============================
// GEMINI API CALL (CLIENT-SIDE)
// =============================
async function fetchGeminiResponse(userMessage) {
  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: userMessage }]
      }]
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.';
}

// =============================
// TYPING INDICATOR
// =============================
function showTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.classList.add("message", "bot");
  typingDiv.id = "typing";
  typingDiv.textContent = "Typing...";
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingIndicator() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}
