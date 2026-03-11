# 🌍 ECE496 Translation API Project

A complete translation API backend built with Node.js/Express, designed to work seamlessly with Swift iOS applications.

---

## 📚 Documentation

**For the iOS / frontend developer (start here):**

| Document | Purpose |
|----------|---------|
| **[iOS_INTEGRATION_GUIDE.md](iOS_INTEGRATION_GUIDE.md)** | **Single guide:** how to implement the API in Swift (beginner-friendly, copy-paste ready) |

**For backend / other docs:** see the [docs/](docs/) folder (deployment, architecture, presentations, etc.).  
Backend API details: [backend/README.md](backend/README.md).

---

## 🚀 Quick Start

### For Backend Developers

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Test locally:**
   ```bash
   npm start
   ```

3. **Deploy to Render:**
   - Follow [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
   - **Important:** Set Root Directory to `backend`

### For iOS / Swift Developers

1. **Open the guide:** [iOS_INTEGRATION_GUIDE.md](iOS_INTEGRATION_GUIDE.md)
2. Follow the steps: add the `TranslationAPI.swift` file, set the API URL, then use the examples in your app
3. **API URL:** Get the real base URL from the backend teammate and set it in `TranslationAPI.baseURL`

---

## 🎯 What This API Does

- ✅ Translates words from English to 15+ languages
- ✅ Returns translation confidence scores
- ✅ Provides alternative translations
- ✅ **Multiple example sentences (3-5 per word)** for better learning 📚
- ✅ **Get pronunciation audio URLs for any word in any language** 🔊
- ✅ Lists all supported languages
- ✅ Health check endpoint for monitoring
- ✅ CORS enabled for web/mobile apps
- ✅ Free to use (no API keys required)

---

## 🌐 API Endpoints

### Health Check
```
GET /health
```
Check if the API is running.

### Translate Word
```
POST /api/translate
Content-Type: application/json

{
  "word": "hello",
  "targetLanguage": "es"
}
```
Translate a word to another language.

### Get Pronunciation Audio URL 🔊
```
POST /api/pronunciation
Content-Type: application/json

{
  "word": "hola",
  "language": "es"
}
```
Get an audio URL to play pronunciation of a word in any language. Returns a URL that can be used with iOS AVPlayer.

### Get Languages
```
GET /api/languages
```
Get list of all supported languages.

---

## 🗣️ Supported Languages

Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese (Simplified & Traditional), Arabic, Hindi, Dutch, Polish, Turkish

See full list in [iOS_INTEGRATION_GUIDE.md](iOS_INTEGRATION_GUIDE.md)

---

## 🛠️ Technology Stack

- **Backend Framework:** Express.js (Node.js)
- **Translation Service:** MyMemory Translation API
- **Deployment:** Render.com
- **Frontend:** Swift/iOS (your teammate's part)

---

## 📱 Example Usage

### cURL (Terminal)
```bash
curl -X POST https://your-app.onrender.com/api/translate \
  -H "Content-Type: application/json" \
  -d '{"word":"hello","targetLanguage":"es"}'
```

### Swift
```swift
TranslationAPI.translate(word: "hello", to: "es") { result in
    switch result {
    case .success(let translation):
        print("Translated: \(translation.translated)")
    case .failure(let error):
        print("Error: \(error)")
    }
}
```

Full Swift code and usage in [iOS_INTEGRATION_GUIDE.md](iOS_INTEGRATION_GUIDE.md)

---

## ✅ Testing

Run the automated test suite:
```bash
cd backend
npm test
```

All 5 tests should pass:
- ✅ Health check
- ✅ Spanish translation
- ✅ French translation
- ✅ Get languages
- ✅ Error handling

---

## 🐛 Troubleshooting

### Deployment Failed?
→ Check [docs/RENDER_FIX.md](docs/RENDER_FIX.md)

### iOS Integration Issues?
→ Check [iOS_INTEGRATION_GUIDE.md](iOS_INTEGRATION_GUIDE.md) — section “If something goes wrong”

### API Not Responding?
1. Check health endpoint: `https://your-app.onrender.com/health`
2. Verify Render service is running
3. Check Render logs for errors

---

## 📞 Project Structure

```
ece496-project/
├── iOS_INTEGRATION_GUIDE.md     # For frontend: single Swift integration guide
├── README.md                     # This file
├── backend/                      # Backend API
│   ├── server.js
│   ├── package.json
│   ├── test.js
│   └── README.md
└── docs/                         # Other docs (deploy, architecture, etc.)
    ├── QUICK_DEPLOY.md
    ├── RENDER_FIX.md
    └── ...
```

---

## 🎓 For Your Teammate (iOS / Frontend)

**Send them this:**

> The API is ready. Use **one guide only:** [iOS_INTEGRATION_GUIDE.md](iOS_INTEGRATION_GUIDE.md)
>
> 1. Open that file and follow the steps in order.
> 2. Add the `TranslationAPI.swift` file (copy-paste from the guide).
> 3. Set the API URL in that file (I’ll send you the real URL).
> 4. Use the code examples in the guide to call translate, examples, and pronunciation.
>
> Everything is in that one doc — no backend knowledge needed.

---

## 📄 License

MIT

---

## 🎉 Status

✅ Backend built and tested
✅ Documentation complete
✅ Ready for deployment
✅ Swift integration guide ready

**Next Step:** Deploy to Render using [docs/QUICK_DEPLOY.md](docs/QUICK_DEPLOY.md)

---

**Built for ECE496 Project**
