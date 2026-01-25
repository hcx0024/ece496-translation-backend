# 🧪 Testing Pronunciation Endpoint Locally

## Quick Test Steps

### 1. Start the Server

Open a terminal and run:
```bash
cd backend
npm start
```

You should see:
```
🚀 Translation API server running on port 3000
📍 Environment: development
🌐 Health check: http://localhost:3000/health
```

### 2. Test the Pronunciation Endpoint

**Option A: Using the test script**
```bash
# In a new terminal window (keep server running)
cd backend
node test-pronunciation.js
```

**Option B: Using curl**
```bash
# Test pronunciation for "hola" in Spanish
curl -X POST http://localhost:3000/api/pronunciation \
  -H "Content-Type: application/json" \
  -d '{"word":"hola","language":"es"}'
```

**Option C: Test in Browser**

1. First, get the audio URL:
   ```bash
   curl -X POST http://localhost:3000/api/pronunciation \
     -H "Content-Type: application/json" \
     -d '{"word":"hola","language":"es"}' | jq -r '.audioUrl'
   ```

2. Copy the URL and paste it in your browser - it should play the audio!

### 3. Expected Response

```json
{
  "success": true,
  "word": "hola",
  "language": "es",
  "audioUrl": "https://translate.google.com/translate_tts?ie=UTF-8&tl=es&client=tw-ob&q=hola",
  "format": "mp3",
  "source": "Google Translate TTS",
  "timestamp": "2026-01-25T..."
}
```

### 4. Test Different Languages

```bash
# French
curl -X POST http://localhost:3000/api/pronunciation \
  -H "Content-Type: application/json" \
  -d '{"word":"bonjour","language":"fr"}'

# Japanese
curl -X POST http://localhost:3000/api/pronunciation \
  -H "Content-Type: application/json" \
  -d '{"word":"こんにちは","language":"ja"}'

# Chinese
curl -X POST http://localhost:3000/api/pronunciation \
  -H "Content-Type: application/json" \
  -d '{"word":"你好","language":"zh-CN"}'
```

### 5. Test Error Handling

```bash
# Missing word (should return 400 error)
curl -X POST http://localhost:3000/api/pronunciation \
  -H "Content-Type: application/json" \
  -d '{"language":"es"}'
```

### 6. Download and Play Audio

```bash
# Get the audio URL and download it
curl -X POST http://localhost:3000/api/pronunciation \
  -H "Content-Type: application/json" \
  -d '{"word":"hola","language":"es"}' | \
  jq -r '.audioUrl' | \
  xargs curl --output test-pronunciation.mp3

# Play it (macOS)
afplay test-pronunciation.mp3
```

## ✅ Success Indicators

- ✅ Server starts without errors
- ✅ Health endpoint returns `{"status":"healthy"}`
- ✅ Pronunciation endpoint returns `audioUrl` field
- ✅ Audio URL can be opened in browser and plays sound
- ✅ Error handling works for missing fields

## 🐛 Troubleshooting

**Server won't start?**
- Check if port 3000 is already in use: `lsof -ti:3000`
- Kill existing process: `kill -9 $(lsof -ti:3000)`

**"Cannot find module" error?**
- Run: `npm install` in the backend directory

**Connection refused?**
- Make sure the server is running in another terminal
- Check the server is listening on port 3000
