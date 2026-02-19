// =============================
// CONFIGURATION
// =============================
// Add your Google Gemini API key here
const API_KEY = "AIzaSyB72d-Yypo8W-F2bQao5bjRo5EPzTmf21c";
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
// EVENT LISTENERS
// =============================
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
    const error = await response.json();
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
