# Gemini AI Chatbot

A secure, real-time chatbot powered by **Google Gemini AI** running on a local Express server with a floating popup UI.

## Features

✅ **Secure server-side proxy** — API key never exposed to the browser  
✅ **Rate limiting** — Protected against abuse (20 req/15 min per IP)  
✅ **CORS restricted** — Only localhost:5500 can access  
✅ **Input validation** — Max 500 char messages, 1KB payload limit  
✅ **Floating UI** — Chat button in bottom-right, pops up on click  
✅ **Error handling** — User-friendly error messages, no API details leaked  

## Setup

### Prerequisites
- Node.js v14+ installed
- Google Gemini API key ([get it free here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repo**
   ```bash
   git clone <your-repo-url>
   cd Javascript
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your Google API key:
     ```env
     GOOGLE_API_KEY=your_actual_api_key_here
     GEMINI_MODEL=gemini-2.5-flash
     PORT=5500
     ```

4. **Start the server**
   ```bash
   npm start
   ```
   
   Server runs at: **http://localhost:5500**

5. **Open in browser**
   - Visit: http://localhost:5500
   - Click the 💬 button in the bottom-right
   - Start chatting!

## Security

- **API Key Protection**: `.env` is in `.gitignore` — never commit your key
- **CORS**: Only localhost:5500 can call the API
- **Rate Limiting**: 20 requests per 15 minutes per IP
- **Input Validation**: Messages max 500 chars, payloads max 1KB
- **Error Hiding**: Sensitive errors are not exposed to the client

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `GOOGLE_API_KEY` | (required) | Your Google Gemini API key |
| `GEMINI_MODEL` | `gemini-2.5-flash` | Model to use (see [available models](https://ai.google.dev/models)) |
| `PORT` | `5500` | Port to run the server on |

## Project Structure

```
.
├── index.html          # Chat UI
├── Firstscript.js      # Client-side chat logic
├── styles.css          # Styling (floating popup)
├── server.js           # Express server + Gemini proxy
├── package.json        # Dependencies & scripts
├── .env.example        # Template for environment variables
├── .env                # Your API key (not in git)
├── .gitignore          # Excludes .env and node_modules
└── README.md           # This file
```

## Available Models

Change `GEMINI_MODEL` in `.env` to switch models:
- `gemini-2.5-flash` (default, fastest)
- `gemini-2.5-pro` (most capable)
- `gemini-2.0-flash-lite` (lightweight)

## Troubleshooting

### "API key not valid"
- Ensure `.env` has a valid `GOOGLE_API_KEY`
- Restart the server after updating `.env`

### "Too many requests"
- Wait 15 minutes for rate limit to reset

### Port 5500 already in use
- Change `PORT` in `.env` to a different port (e.g., 3000)

## Deployment

To deploy this to a live server:
1. Use a `.env` file or environment variables for your hosting platform
2. Set `CORS` origin to your actual domain
3. Consider using a reverse proxy (nginx) for additional security
4. Use HTTPS in production

## License

MIT

## Support

For issues or questions, please open a GitHub issue.

