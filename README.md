# 🌍 ECE496 Translation API Project

A complete translation API backend built with Node.js/Express, designed to work seamlessly with Swift iOS applications.

---

## 📚 Documentation

| Document | Purpose | For Who |
|----------|---------|---------|
| **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** | Deploy to Render in 5 minutes | Backend developers |
| **[RENDER_FIX.md](RENDER_FIX.md)** | Fix deployment errors | Backend developers |
| **[SWIFT_INTEGRATION_GUIDE.md](SWIFT_INTEGRATION_GUIDE.md)** | Complete Swift integration guide | Swift/iOS developers |
| **[backend/README.md](backend/README.md)** | Full API documentation | All developers |
| **[SWEEP.md](SWEEP.md)** | Quick command reference | All developers |

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

### For Swift Developers

1. **Read the guide:** [SWIFT_INTEGRATION_GUIDE.md](SWIFT_INTEGRATION_GUIDE.md)
2. **Copy the Swift code** from the guide
3. **Update the API URL** with your Render deployment URL
4. **Start building!**

---

## 🎯 What This API Does

- ✅ Translates words from English to 15+ languages
- ✅ Returns translation confidence scores
- ✅ Provides alternative translations
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

See full list in [SWIFT_INTEGRATION_GUIDE.md](SWIFT_INTEGRATION_GUIDE.md)

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

Full Swift code available in [SWIFT_INTEGRATION_GUIDE.md](SWIFT_INTEGRATION_GUIDE.md)

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
→ Check [RENDER_FIX.md](RENDER_FIX.md)

### Swift Integration Issues?
→ Check [SWIFT_INTEGRATION_GUIDE.md](SWIFT_INTEGRATION_GUIDE.md) - Section "Common Issues"

### API Not Responding?
1. Check health endpoint: `https://your-app.onrender.com/health`
2. Verify Render service is running
3. Check Render logs for errors

---

## 📞 Project Structure

```
ece496-project/
├── backend/                      # Backend API
│   ├── server.js                # Main server file
│   ├── package.json             # Dependencies
│   ├── test.js                  # Test suite
│   └── README.md                # Backend docs
├── QUICK_DEPLOY.md              # Deployment guide
├── RENDER_FIX.md                # Deployment troubleshooting
├── SWIFT_INTEGRATION_GUIDE.md   # Swift developer guide
├── SWEEP.md                     # Command reference
└── README.md                    # This file
```

---

## 🎓 For Your Teammate (Swift Developer)

**Send them this:**

> Hey! The translation API is ready. Here's what you need:
>
> 1. **Read this guide:** [SWIFT_INTEGRATION_GUIDE.md](SWIFT_INTEGRATION_GUIDE.md)
> 2. **API URL:** `https://your-app-name.onrender.com` (I'll send you the actual URL)
> 3. **Test it first:** Open `https://your-app-name.onrender.com/health` in Safari
> 4. **Copy the Swift code** from the guide - it's ready to use!
>
> The guide has everything you need, including:
> - Complete Swift code (just copy & paste)
> - SwiftUI example app
> - How to test without writing code
> - Common issues and solutions
>
> Let me know if you have questions!

---

## 📄 License

MIT

---

## 🎉 Status

✅ Backend built and tested
✅ Documentation complete
✅ Ready for deployment
✅ Swift integration guide ready

**Next Step:** Deploy to Render using [QUICK_DEPLOY.md](QUICK_DEPLOY.md)

---

**Built for ECE496 Project**
