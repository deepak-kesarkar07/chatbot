// =============================
// CONFIGURATION
// =============================
// NOTE: API key removed from client for security. The client calls
// the local backend at `/api/chat` which proxies requests to Gemini.

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
    console.error('Fetch error:', error);
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
// GEMINI API CALL
// =============================
async function fetchGeminiResponse(userMessage) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage })
  });

  // Try to parse error details if the server returned an error
  let data;
  try {
    data = await response.json();
  } catch (e) {
    const text = await response.text().catch(() => '');
    throw new Error(response.ok ? 'Invalid JSON in response' : `Server error: ${text || response.status}`);
  }

  if (!response.ok) {
    const detail = data?.error || data?.details || JSON.stringify(data);
    throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
  }

  return data.reply || 'No response received.';
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
