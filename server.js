require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 5500;
const API_KEY = process.env.GOOGLE_API_KEY; // set this in your environment
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent`;

if (!API_KEY) {
  console.warn('Warning: GOOGLE_API_KEY env var not set. Set it before starting the server.');
}

// Restrict CORS to localhost:5500 only
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate limiter: max 20 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json({ limit: '1kb' }));
app.use(express.static(path.join(__dirname)));
app.use(limiter);

// Request logger (logs without exposing sensitive data)
app.use((req, res, next) => {
  if (['/api/chat'].includes(req.path)) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} from ${req.ip}`);
  }
  next();
});

app.post('/api/chat', async (req, res) => {
  try {
    const message = req.body.message;
    if (!message) return res.status(400).json({ error: 'No message provided' });
    if (typeof message !== 'string' || message.length > 500) {
      return res.status(400).json({ error: 'Invalid message' });
    }
    const resp = await axios.post(`${API_URL}?key=${API_KEY}`, {
      contents: [
        {
          parts: [
            { text: message }
          ]
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = resp.data;

    // Try a few common response shapes
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
      || data.candidates?.[0]?.output
      || data.output?.[0]?.content
      || data.output?.text
      || data.reply
      || JSON.stringify(data);

    res.json({ reply });
  } catch (err) {
    console.error(err.response?.data || err.message || err);
    res.status(500).json({ error: 'Unable to process request. Please try again.' });
  }
});


// Removed public /api/models endpoint (security)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
