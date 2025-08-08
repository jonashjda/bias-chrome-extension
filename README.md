## Political Bias Chrome Extension

Analyze the political bias of the current web page using a Chrome extension and a small Node/Express backend powered by the OpenAI API.

### Prerequisites
- Node.js 18+ and npm
- An OpenAI API key
- Google Chrome

### Repository Layout
```
bias-chrome-extension/
  chrome-extension/        # Extension source (manifest v3)
  political-bias-backend/  # Node/Express server
```

### 1) Clone the repository
```bash
git clone https://github.com/your-username/bias-chrome-extension.git
cd bias-chrome-extension
```

### 2) Set up and run the backend
The backend exposes `POST /api/analyze` on `http://localhost:3000`.

1. Go to the backend directory:
   ```bash
   cd political-bias-backend
   ```
2. Create a `.env` file containing your OpenAI key:
   ```
   OPENAI_API_KEY=your_real_openai_api_key
   ```
3. Install dependencies and start the server:
   ```bash
   npm install
   node server.js
   ```
   You should see: `Server running on http://localhost:3000`.

Optional quick test (from another terminal):
```bash
curl -s -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"content":"This is a sample paragraph to analyze."}'
```

### 3) Load the extension in Chrome (Developer Mode)
1. Open Chrome and go to `chrome://extensions/`.
2. Enable "Developer mode" (toggle in the top-right).
3. Click "Load unpacked".
4. Select the `chrome-extension` folder inside this repo.
5. The extension should appear in your toolbar. Pin it if needed.

### 4) Use the extension
1. Start the backend (see step 2).
2. Navigate to any web page with text content.
3. Click the extension icon, then click "Analyze Page".
4. You should see a rating and explanation returned by the backend.

### Configuration notes
- The extension is configured to call `http://localhost:3000/api/analyze`. If you deploy the backend elsewhere, update the fetch URLs in:
  - `chrome-extension/background.js`
  - `chrome-extension/popup.js`

### Security
- Do not commit your `.env` file. This repo includes a `.gitignore` that ignores `.env` by default.
- Treat your API key as a secret. Never embed it in extension code.

### License
MIT


